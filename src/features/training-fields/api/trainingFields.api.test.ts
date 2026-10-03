import { afterEach, beforeEach, expect, it, vi } from "vitest"
import * as api from "./trainingFields.api"
import * as session from "@/features/auth/model/auth.session"

const response = (data: unknown, status = 200, message = "완료") =>
  new Response(JSON.stringify({ status, message, data }), { status })
const fetchMock = vi.fn()
beforeEach(async () => {
  fetchMock.mockReset()
  vi.stubGlobal("fetch", fetchMock)
  fetchMock.mockResolvedValueOnce(
    response({
      userId: 1,
      name: "관리자",
      email: "admin@example.com",
      accessToken: "old",
      refreshToken: "refresh",
    }),
  )
  await session.login({ email: "admin@example.com", password: "password" })
  fetchMock.mockReset()
})
afterEach(() => {
  session.clearSession()
  vi.unstubAllGlobals()
})

it("100개를 넘는 목록도 page를 증가시키며 끝까지 조회한다", async () => {
  const first = Array.from({ length: 100 }, (_, i) => ({
    trainingFieldId: 101 - i,
    name: `분야 ${i}`,
    isActive: true,
  }))
  fetchMock
    .mockResolvedValueOnce(response({ content: first, page: 1, hasNext: true }))
    .mockResolvedValueOnce(
      response({
        content: [{ trainingFieldId: 1, name: "비활성", isActive: false }],
        page: 2,
        hasNext: false,
      }),
    )
  const fields = await api.getAllTrainingFields()
  expect(fields).toHaveLength(101)
  expect(fields[100].isActive).toBe(false)
  expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
    "/api/v1/training-fields?page=1&size=100",
    "/api/v1/training-fields?page=2&size=100",
  ])
})

it("등록·수정·삭제에 명세의 경로, 메서드, 이름과 활성 여부를 보낸다", async () => {
  const field = { trainingFieldId: 8, name: "새 분야", isActive: false }
  fetchMock
    .mockResolvedValueOnce(response(field, 201))
    .mockResolvedValueOnce(response({ ...field, isActive: true }))
    .mockResolvedValueOnce(response(null))
  await expect(
    api.createTrainingField({ name: "새 분야", isActive: false }),
  ).resolves.toEqual(field)
  await api.updateTrainingField(8, { name: "새 분야", isActive: true })
  await api.deleteTrainingField(8)
  expect(
    fetchMock.mock.calls.map(([url, init]) => [url, init.method, init.body]),
  ).toEqual([
    [
      "/api/v1/training-fields",
      "POST",
      JSON.stringify({ name: "새 분야", isActive: false }),
    ],
    [
      "/api/v1/training-fields/8",
      "PUT",
      JSON.stringify({ name: "새 분야", isActive: true }),
    ],
    ["/api/v1/training-fields/8", "DELETE", undefined],
  ])
  expect(fetchMock.mock.calls[0][1].headers.get("Authorization")).toBe(
    "Bearer old",
  )
  expect(fetchMock.mock.calls[0][1].headers.get("Content-Type")).toBe(
    "application/json",
  )
})

it("401 수정 요청은 토큰 재발급 후 동일 본문으로 한 번 재시도한다", async () => {
  const field = { trainingFieldId: 2, name: "수정", isActive: false }
  fetchMock
    .mockResolvedValueOnce(response(null, 401))
    .mockResolvedValueOnce(
      response({ accessToken: "new", refreshToken: "new-refresh" }),
    )
    .mockResolvedValueOnce(response(field))
  await api.updateTrainingField(2, { name: "수정", isActive: false })
  expect(fetchMock).toHaveBeenCalledTimes(3)
  expect(fetchMock.mock.calls[2][1].headers.get("Authorization")).toBe(
    "Bearer new",
  )
  expect(fetchMock.mock.calls[2][1].body).toBe(fetchMock.mock.calls[0][1].body)
})

it("403 관리자 권한 오류는 재발급하지 않고 서버 메시지를 전달한다", async () => {
  fetchMock.mockResolvedValue(response(null, 403, "관리자 권한이 필요합니다."))
  await expect(api.getAllTrainingFields()).rejects.toMatchObject({
    httpStatus: 403,
    message: "관리자 권한이 필요합니다.",
  })
  expect(fetchMock).toHaveBeenCalledTimes(1)
})

it("잘못된 페이지 응답에서 무한 조회를 하지 않는다", async () => {
  fetchMock.mockResolvedValue(response({ content: [], page: 1, hasNext: true }))
  await expect(api.getAllTrainingFields()).rejects.toMatchObject({
    httpStatus: 502,
  })
  expect(fetchMock).toHaveBeenCalledTimes(1)
})
