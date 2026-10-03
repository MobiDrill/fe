import { afterEach, describe, expect, it, vi } from "vitest"
import * as api from "./auth.api"

afterEach(() => vi.unstubAllGlobals())
const envelope = (data: unknown, status = 200) =>
  new Response(JSON.stringify({ status, message: "서버 메시지", data }), {
    status,
  })
describe("인증 API", () => {
  it("가입 네 필드를 전송하고 201 응답을 처리한다", async () => {
    const fetchMock = vi.fn().mockResolvedValue(envelope(null, 201))
    vi.stubGlobal("fetch", fetchMock)
    const request = {
      name: "이름",
      email: "test@example.com",
      password: "12345678",
      passwordConfirm: "12345678",
    }
    await api.registerEmail(request)
    expect(fetchMock.mock.calls[0][0]).toBe("/api/v1/auth/register/email")
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(request)
  })
  it("로그아웃의 헤더와 본문 토큰이 동일하다", async () => {
    const fetchMock = vi.fn().mockResolvedValue(envelope(null))
    vi.stubGlobal("fetch", fetchMock)
    await api.logout({ accessToken: "access", refreshToken: "refresh" })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe("/api/v1/auth/logout")
    expect(init.headers.get("Authorization")).toBe("Bearer access")
    expect(JSON.parse(init.body)).toEqual({
      accessToken: "access",
      refreshToken: "refresh",
    })
  })
  it.each([400, 401, 403, 409, 503])(
    "HTTP %i를 서버 메시지와 함께 전달한다",
    async (status) => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(envelope(null, status)))
      await expect(
        api.loginEmail({ email: "test@example.com", password: "wrong" }),
      ).rejects.toMatchObject({ httpStatus: status, message: "서버 메시지" })
    },
  )
  it("비 JSON 실패 및 네트워크 실패를 정규화한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("Bad Gateway", { status: 502 })),
    )
    await expect(
      api.refreshToken({ refreshToken: "refresh" }),
    ).rejects.toMatchObject({ httpStatus: 502 })
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("network")))
    await expect(
      api.refreshToken({ refreshToken: "refresh" }),
    ).rejects.toMatchObject({ httpStatus: 0 })
  })
  it("누락된 토큰 또는 사용자 응답을 거부한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(envelope({ accessToken: "access" })),
    )
    await expect(
      api.refreshToken({ refreshToken: "refresh" }),
    ).rejects.toMatchObject({ httpStatus: 502 })
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(envelope({ accessToken: "a", refreshToken: "r" })),
    )
    await expect(
      api.loginEmail({ email: "test@example.com", password: "12345678" }),
    ).rejects.toMatchObject({ httpStatus: 502 })
  })
})
