import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, expect, it, vi } from "vitest"
import ManualListPage from "./ManualListPage"
import { getManuals } from "../api/manuals.api"

vi.mock("../api/manuals.api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../api/manuals.api")>()),
  getManuals: vi.fn(),
}))
const data = {
  metadata: {
    totalManualCount: 31,
    extractionOngoingCount: 5,
    reviewNeedCount: 4,
    questionGenerationOngoingCount: 3,
    questionReviewNeedCount: 2,
  },
  manuals: {
    content: [
      {
        manualId: 7,
        manualTitle: "서버 교범",
        fileType: "PDF" as const,
        registeredByName: "실제등록자",
        trainingField: { id: 4, name: "안전" },
        manualStatus: "ABNORMAL_TERMINATION" as const,
        updatedAt: "2026-10-04T01:00:00",
      },
    ],
    page: 1,
    size: 10,
    totalElements: 31,
    totalPages: 4,
    hasNext: true,
    hasPrevious: false,
    nextCursor: null,
  },
}
const props = {
  enabled: true,
  owner: 1,
  entryRevision: 0,
  trainingFields: [{ trainingFieldId: 4, name: "안전", isActive: true }],
  reviewProgress: {},
  problemReviewProgress: {},
  onRegister: vi.fn(),
  onOpenReview: vi.fn(),
  onOpenProblemPreview: vi.fn(),
  onOpenProblemReview: vi.fn(),
  onNotify: vi.fn(),
}
afterEach(() => {
  cleanup()
  vi.mocked(getManuals).mockReset()
})

it("실제 등록자·상태·서버 통계를 표시하고 페이지와 분야 선택을 서버 조회에 전달한다", async () => {
  vi.mocked(getManuals).mockResolvedValue(data)
  render(<ManualListPage {...props} />)
  expect(screen.getByRole("status").textContent).toContain("불러오고")
  await screen.findByText("서버 교범")
  expect(screen.getByText("PDF · 실제등록자 등록")).toBeTruthy()
  expect(screen.getByText("31")).toBeTruthy()
  expect(screen.getByText("총 31개 중 1–1")).toBeTruthy()
  const user = userEvent.setup()
  await user.click(screen.getByRole("button", { name: "2" }))
  await waitFor(() =>
    expect(getManuals).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2 }),
      expect.any(AbortSignal),
    ),
  )
  await screen.findByText("서버 교범")
  await user.click(
    screen.getByRole("button", { name: "전체 분야" }),
  )
  await user.click(screen.getByRole("button", { name: "안전" }))
  await waitFor(() =>
    expect(getManuals).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1, trainingFieldId: 4 }),
      expect.any(AbortSignal),
    ),
  )
})

it("실패 화면에서 다시 조회한 뒤 빈 목록을 표시한다", async () => {
  vi.mocked(getManuals)
    .mockRejectedValueOnce(new Error("조회 실패"))
    .mockResolvedValueOnce({
      ...data,
      manuals: {
        ...data.manuals,
        content: [],
        totalElements: 0,
        totalPages: 0,
      },
      metadata: { ...data.metadata, totalManualCount: 0 },
    })
  render(<ManualListPage {...props} />)
  expect((await screen.findByRole("alert")).textContent).toBe("조회 실패")
  expect(screen.queryByText("검색 결과가 없습니다")).toBeNull()
  await userEvent
    .setup()
    .click(screen.getByRole("button", { name: "다시 시도" }))
  await screen.findByText("검색 결과가 없습니다")
  expect(screen.getByText("총 0개 중 0–0")).toBeTruthy()
})
