import { act, cleanup, renderHook, waitFor } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import useManualList, { toManualDocument } from "./useManualList"
import { getManuals, manualStatuses } from "../api/manuals.api"
import type { ManualApiStatus, ManualListResponse } from "../api/manuals.api"

vi.mock("../api/manuals.api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../api/manuals.api")>()),
  getManuals: vi.fn(),
}))
const response = (title = "실제 교범"): ManualListResponse => ({
  metadata: {
    totalManualCount: 21,
    extractionOngoingCount: 4,
    reviewNeedCount: 3,
    questionGenerationOngoingCount: 2,
    questionReviewNeedCount: 1,
  },
  manuals: {
    content: [
      {
        manualId: 7,
        manualTitle: title,
        fileType: null,
        registeredByName: "등록자",
        trainingField: null,
        manualStatus: "REVIEW_NEED",
        updatedAt: "2026-10-04T03:00:00",
      },
    ],
    page: 1,
    size: 10,
    totalElements: 21,
    totalPages: 3,
    hasNext: true,
    hasPrevious: false,
    nextCursor: null,
  },
})
afterEach(() => {
  cleanup()
  vi.mocked(getManuals).mockReset()
})

it("서버 통계와 페이지를 사용하고 조건 변경 시 첫 페이지에서 다시 조회한다", async () => {
  vi.mocked(getManuals).mockResolvedValue(response())
  const { result } = renderHook(() => useManualList(true, 1))
  await waitFor(() =>
    expect(result.current.documents[0]?.name).toBe("실제 교범"),
  )
  expect(result.current.total).toBe(21)
  expect(result.current.totalPages).toBe(3)
  expect(result.current.metadata?.extractionOngoingCount).toBe(4)
  act(() => result.current.setCurrentPage(2))
  await waitFor(() =>
    expect(getManuals).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2 }),
      expect.any(AbortSignal),
    ),
  )
  act(() => {
    result.current.setSearchQuery("안전")
    result.current.setSelectedField("9")
    result.current.setSortOrder("예전 등록순")
    result.current.setScope("문제 검수 중")
  })
  await waitFor(() =>
    expect(getManuals).toHaveBeenLastCalledWith(
      {
        page: 1,
        size: 10,
        sort: "OLDEST",
        manualTitle: "안전",
        trainingFieldId: 9,
        manualStatus: "QUESTION_REVIEW_ONGOING",
      },
      expect.any(AbortSignal),
    ),
  )
})

it("새 검색 이후 늦게 도착한 이전 응답과 로그아웃 이후 응답을 무시한다", async () => {
  let resolveOld: (value: ManualListResponse) => void
  vi.mocked(getManuals)
    .mockReturnValueOnce(
      new Promise((resolve) => {
        resolveOld = resolve
      }),
    )
    .mockResolvedValue(response("새 교범"))
  const { result, rerender } = renderHook(
    ({ enabled }) => useManualList(enabled, 1),
    {
      initialProps: { enabled: true },
    },
  )
  await waitFor(() => expect(getManuals).toHaveBeenCalledTimes(1))
  const signal = vi.mocked(getManuals).mock.calls[0][1]
  act(() => result.current.setSearchQuery("새"))
  expect(signal?.aborted).toBe(true)
  await waitFor(() => expect(result.current.documents[0]?.name).toBe("새 교범"))
  await act(async () => resolveOld(response("이전 교범")))
  expect(result.current.documents[0]?.name).toBe("새 교범")
  rerender({ enabled: false })
  expect(result.current.documents).toEqual([])
  expect(result.current.loading).toBe(false)
})

it("조회 실패를 표시하고 재시도 및 재진입 때 서버를 다시 조회한다", async () => {
  vi.mocked(getManuals)
    .mockRejectedValueOnce(new Error("권한 없음"))
    .mockResolvedValue(response())
  const { result, rerender } = renderHook(
    ({ entry }) => useManualList(true, 1, entry),
    {
      initialProps: { entry: 0 },
    },
  )
  await waitFor(() => expect(result.current.loadError).toBe("권한 없음"))
  act(() => result.current.reload())
  await waitFor(() => expect(result.current.documents).toHaveLength(1))
  expect(result.current.loadError).toBe("")
  rerender({ entry: 1 })
  await waitFor(() => expect(getManuals).toHaveBeenCalledTimes(3))
})

it("모든 API 상태와 연결 없는 분야·파일을 화면에 매핑한다", () => {
  for (const status of Object.keys(manualStatuses) as ManualApiStatus[]) {
    const document = toManualDocument({
      ...response().manuals.content[0],
      manualStatus: status,
    })
    expect(document.state).toBe(manualStatuses[status])
    expect(document.field).toBe("미지정")
    expect(document.type).toBe("—")
    expect(document.registeredByName).toBe("등록자")
  }
})
