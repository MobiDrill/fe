import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const user = { userId: 1, name: "테스트", email: "test@example.com" }
const pair = { accessToken: "old-access", refreshToken: "old-refresh" }
const rotated = { accessToken: "new-access", refreshToken: "new-refresh" }
const response = (data: unknown, status = 200) =>
  new Response(JSON.stringify({ status, message: "테스트 응답", data }), {
    status,
  })
const deferred = <T>() => {
  let resolve: (value: T) => void = () => { throw new Error("Promise가 초기화되지 않았습니다.") }
  const promise = new Promise<T>((done) => {
    resolve = done
  })
  return { promise, resolve }
}
beforeEach(() => {
  vi.resetModules()
  sessionStorage.clear()
})
afterEach(() => vi.unstubAllGlobals())
async function setup() {
  const session = await import("../model/auth.session")
  const { authenticatedRequest } = await import("./authenticatedRequest")
  const fetchMock = vi.fn().mockResolvedValue(response({ ...user, ...pair }))
  vi.stubGlobal("fetch", fetchMock)
  await session.login({ email: user.email, password: "12345678" })
  fetchMock.mockReset()
  return { session, authenticatedRequest, fetchMock }
}
describe("세션과 자동 재발급", () => {
  it("로그아웃은 진행 중 재발급을 기다리며 보호 요청을 재시도하지 않는다", async () => {
    const { session, authenticatedRequest, fetchMock } = await setup()
    const refresh = deferred<Response>()
    fetchMock.mockImplementation((path) => {
      if (path.endsWith("/refresh")) return refresh.promise
      return Promise.resolve(path.endsWith("/logout") ? response(null) : response(null, 401))
    })
    const request = authenticatedRequest("/api/v1/protected")
    const rejected = expect(request).rejects.toMatchObject({ httpStatus: 401 })
    await vi.waitFor(() => expect(fetchMock.mock.calls.filter(([url]) => url.endsWith("/refresh"))).toHaveLength(1))
    const loggingOut = session.logout()
    refresh.resolve(response(rotated))
    await Promise.all([rejected, loggingOut])
    expect(fetchMock.mock.calls.filter(([url]) => url === "/api/v1/protected")).toHaveLength(1)
    const [, init] = fetchMock.mock.calls.find(([url]) => url.endsWith("/logout"))!
    expect(JSON.parse(init.body)).toEqual(rotated)
    expect(session.getTokens()).toBeNull()
  })
  it("늦은 401은 이미 교체된 토큰 쌍을 사용하고 재발급을 반복하지 않는다", async () => {
    const { session, authenticatedRequest, fetchMock } = await setup()
    const first = deferred<Response>()
    fetchMock.mockReturnValueOnce(first.promise).mockResolvedValueOnce(response({ ...rotated, accessToken: pair.accessToken })).mockResolvedValueOnce(response("ok"))
    const request = authenticatedRequest("/api/v1/protected")
    await session.refreshSession()
    first.resolve(response(null, 401))
    await expect(request).resolves.toBe("ok")
    expect(fetchMock.mock.calls.filter(([url]) => url.endsWith("/refresh"))).toHaveLength(1)
  })
  it("동시 401은 재발급 하나를 공유하고 두 토큰을 교체한다", async () => {
    const { session, authenticatedRequest, fetchMock } = await setup()
    const refresh = deferred<Response>()
    fetchMock.mockImplementation((path, init) => {
      if (path === "/api/v1/auth/refresh") return refresh.promise
      return Promise.resolve(
        response(
          "ok",
          init.headers.get("Authorization") === "Bearer old-access" ? 401 : 200,
        ),
      )
    })
    const one = authenticatedRequest("/api/v1/protected")
    const two = authenticatedRequest("/api/v1/protected")
    await vi.waitFor(() =>
      expect(
        fetchMock.mock.calls.filter(([url]) => url === "/api/v1/auth/refresh"),
      ).toHaveLength(1),
    )
    refresh.resolve(response(rotated))
    await expect(Promise.all([one, two])).resolves.toEqual(["ok", "ok"])
    expect(session.getTokens()).toEqual(rotated)
    expect(
      JSON.parse(sessionStorage.getItem("mobidrill.auth.session")!)
        .refreshToken,
    ).toBe("new-refresh")
    expect(sessionStorage.getItem("mobidrill.auth.session")).not.toContain(
      "new-access",
    )
  })
  it("재시도도 401이면 세션을 삭제하며 루프를 만들지 않는다", async () => {
    const { session, authenticatedRequest, fetchMock } = await setup()
    fetchMock.mockImplementation((path) =>
      Promise.resolve(
        path.endsWith("/refresh") ? response(rotated) : response(null, 401),
      ),
    )
    await expect(
      authenticatedRequest("/api/v1/protected"),
    ).rejects.toMatchObject({ httpStatus: 401 })
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(session.getSnapshot().status).toBe("anonymous")
    expect(sessionStorage.length).toBe(0)
  })
  it.each([400, 401, 403])(
    "재발급 %i 실패 시 세션을 삭제한다",
    async (status) => {
      const { session, fetchMock } = await setup()
      fetchMock.mockResolvedValue(response(null, status))
      await expect(session.refreshSession()).rejects.toMatchObject({
        httpStatus: status,
      })
      expect(session.getTokens()).toBeNull()
    },
  )
  it("재발급 네트워크 실패는 재로그인을 강제하지 않는다", async () => {
    const { session, fetchMock } = await setup()
    fetchMock.mockRejectedValue(new TypeError("network"))
    await expect(session.refreshSession()).rejects.toMatchObject({
      httpStatus: 0,
    })
    expect(session.getSnapshot().status).toBe("authenticated")
  })
  it("로그아웃 401 후 최신 토큰을 헤더와 본문에 함께 사용한다", async () => {
    const { session, fetchMock } = await setup()
    fetchMock
      .mockResolvedValueOnce(response(null, 401))
      .mockResolvedValueOnce(response(rotated))
      .mockResolvedValueOnce(response(null))
    await session.logout()
    const [url, init] = fetchMock.mock.calls[2]
    expect(url).toBe("/api/v1/auth/logout")
    expect(JSON.parse(init.body)).toEqual(rotated)
    expect(init.headers.get("Authorization")).toBe("Bearer new-access")
    expect(session.getSnapshot().status).toBe("anonymous")
  })
  it("로그아웃 실패도 로컬 세션을 삭제하고 경고를 표시한다", async () => {
    const { session, fetchMock } = await setup()
    fetchMock.mockRejectedValue(new TypeError("network"))
    await session.logout()
    expect(session.getTokens()).toBeNull()
    expect(session.getSnapshot().message).toContain("확인하지 못했습니다")
  })
  it("세션 종료 후 늦은 재발급 응답이 세션을 복원하지 않는다", async () => {
    const { session, fetchMock } = await setup()
    const refresh = deferred<Response>()
    fetchMock.mockReturnValue(refresh.promise)
    const pending = session.refreshSession()
    session.clearSession()
    refresh.resolve(response(rotated))
    await expect(pending).rejects.toMatchObject({ httpStatus: 401 })
    expect(session.getTokens()).toBeNull()
  })
  it("로그아웃 후 늦은 로그인 응답이 세션을 복원하지 않는다", async () => {
    const { session, fetchMock } = await setup()
    const login = deferred<Response>()
    fetchMock.mockImplementation((path) =>
      path.endsWith("/login/email")
        ? login.promise
        : Promise.resolve(response(null)),
    )
    const pending = session.login({ email: user.email, password: "12345678" })
    await session.logout()
    login.resolve(response({ ...user, ...rotated }))
    await expect(pending).rejects.toThrow("취소")
    expect(session.getTokens()).toBeNull()
  })
  it("새로고침 복원 호출이 중복되어도 재발급은 한 번만 실행한다", async () => {
    const session = await import("../model/auth.session")
    sessionStorage.setItem(
      "mobidrill.auth.session",
      JSON.stringify({ user, refreshToken: pair.refreshToken }),
    )
    const pending = deferred<Response>()
    const fetchMock = vi.fn().mockReturnValue(pending.promise)
    vi.stubGlobal("fetch", fetchMock)
    const one = session.restoreSession()
    const two = session.restoreSession()
    pending.resolve(response(rotated))
    await Promise.all([one, two])
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(session.getSnapshot().status).toBe("authenticated")
    expect(session.getSnapshot().user).toEqual(user)
  })
  it("복원 네트워크 실패 후 다시 시도할 수 있다", async () => {
    const session = await import("../model/auth.session")
    sessionStorage.setItem(
      "mobidrill.auth.session",
      JSON.stringify({ user, refreshToken: pair.refreshToken }),
    )
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("network"))
      .mockResolvedValueOnce(response(rotated))
    vi.stubGlobal("fetch", fetchMock)
    await session.restoreSession()
    expect(session.getSnapshot().restoreError).not.toBe("")
    await session.restoreSession()
    expect(session.getSnapshot().status).toBe("authenticated")
  })
})
