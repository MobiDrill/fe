import { afterEach, expect, it, vi } from "vitest"
import { getManuals, registerManual } from "./manuals.api"
import * as session from "@/features/auth/model/auth.session"

const response = (data: unknown, status = 200, message = "완료") =>
  new Response(JSON.stringify({ status, message, data }), { status })

afterEach(() => {
  session.clearSession()
  vi.unstubAllGlobals()
})

it("필수 페이지 조건과 선택 검색 조건을 인코딩해 인증된 조회 요청으로 전달한다", async () => {
  const data = { metadata: { totalManualCount: 32 }, manuals: { content: [] } }
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(
      response({
        userId: 1,
        name: "관리자",
        email: "admin@example.com",
        accessToken: "access",
        refreshToken: "refresh",
      }),
    )
    .mockImplementation(async () => response(data))
  vi.stubGlobal("fetch", fetchMock)
  await session.login({ email: "admin@example.com", password: "password" })
  const controller = new AbortController()
  await expect(
    getManuals(
      {
        sort: "OLDEST",
        page: 2,
        size: 10,
        manualTitle: "  교범 & 안전  ",
        trainingFieldId: 3,
        manualStatus: "REVIEW_ONGOING",
      },
      controller.signal,
    ),
  ).resolves.toEqual(data)
  const [path, init] = fetchMock.mock.calls[1]
  const params = new URL(path, "http://localhost").searchParams
  expect(Object.fromEntries(params)).toEqual({
    sort: "OLDEST",
    page: "2",
    size: "10",
    manualTitle: "교범 & 안전",
    trainingFieldId: "3",
    manualStatus: "REVIEW_ONGOING",
  })
  expect(init.headers.get("Authorization")).toBe("Bearer access")
  expect(init.signal).toBe(controller.signal)
  await getManuals({ sort: "LATEST", page: 1, size: 10, manualTitle: "   " })
  expect(fetchMock.mock.calls[2][0]).toBe(
    "/api/v1/manuals?sort=LATEST&page=1&size=10",
  )
})

it("JSON 파트와 원본 파일을 전송하고 401 이후 동일 파일을 새 토큰으로 재시도한다", async () => {
  const fetchMock = vi.fn().mockResolvedValueOnce(
    response({
      userId: 1,
      name: "관리자",
      email: "admin@example.com",
      accessToken: "old-access",
      refreshToken: "old-refresh",
    }),
  )
  vi.stubGlobal("fetch", fetchMock)
  await session.login({ email: "admin@example.com", password: "password" })
  const registered = { manualId: 7, manualTitle: "교범" }
  fetchMock
    .mockResolvedValueOnce(response(null, 401))
    .mockResolvedValueOnce(
      response({ accessToken: "new-access", refreshToken: "new-refresh" }),
    )
    .mockResolvedValueOnce(response(registered, 201))
  const request = {
    manualTitle: "교범",
    trainingFieldId: 2,
    manualDescription: "설명",
  }
  const file = new File(["%PDF-1.7"], "manual.pdf", { type: "application/pdf" })
  await expect(registerManual(request, file)).resolves.toEqual(registered)
  const uploads = fetchMock.mock.calls.filter(
    ([path]) => path === "/api/v1/manuals",
  )
  expect(uploads).toHaveLength(2)
  const body = uploads[0][1].body as FormData
  const json = body.get("request") as Blob
  expect(json.type).toBe("application/json")
  const text = await new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsText(json)
  })
  expect(JSON.parse(text)).toEqual(request)
  expect((body.get("file") as File).name).toBe("manual.pdf")
  expect((body.get("file") as File).size).toBe(file.size)
  expect(uploads[0][1].headers.has("Content-Type")).toBe(false)
  expect(uploads[0][1].headers.get("Authorization")).toBe("Bearer old-access")
  expect(uploads[1][1].headers.get("Authorization")).toBe("Bearer new-access")
  expect(uploads[1][1].body).toBe(body)
})
