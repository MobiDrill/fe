import { act, cleanup, renderHook, waitFor } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import useTrainingFields from "./trainingFields"
import { getAllTrainingFields } from "../api/trainingFields.api"
import type { TrainingField } from "../api/trainingFields.api"
vi.mock("../api/trainingFields.api", () => ({ getAllTrainingFields: vi.fn() }))
afterEach(() => {
  cleanup()
  vi.mocked(getAllTrainingFields).mockReset()
})

it("로그아웃 후 늦게 도착한 이전 사용자의 목록을 반영하지 않는다", async () => {
  let resolve: (fields: TrainingField[]) => void = () => {
    throw new Error("요청 전")
  }
  vi.mocked(getAllTrainingFields).mockReturnValue(
    new Promise((done) => {
      resolve = done
    }),
  )
  const { result, rerender } = renderHook(
    ({ enabled }) => useTrainingFields(enabled, 1),
    { initialProps: { enabled: true } },
  )
  rerender({ enabled: false })
  await act(async () => {
    resolve([{ trainingFieldId: 1, name: "이전 사용자 분야", isActive: true }])
  })
  expect(result.current.fields).toEqual([])
  expect(result.current.loading).toBe(false)
  expect(result.current.loadError).toBe("")
})

it("사용자가 변경되면 목록을 비우고 새 사용자의 데이터를 조회한다", async () => {
  vi.mocked(getAllTrainingFields)
    .mockResolvedValueOnce([
      { trainingFieldId: 1, name: "첫 사용자", isActive: true },
    ])
    .mockResolvedValueOnce([
      { trainingFieldId: 2, name: "다음 사용자", isActive: true },
    ])
  const { result, rerender } = renderHook(
    ({ owner }) => useTrainingFields(true, owner),
    { initialProps: { owner: 1 } },
  )
  await waitFor(() => expect(result.current.fields[0]?.name).toBe("첫 사용자"))
  rerender({ owner: 2 })
  expect(result.current.fields).toEqual([])
  await waitFor(() =>
    expect(result.current.fields[0]?.name).toBe("다음 사용자"),
  )
})

it("새 페이지 진입 시 이전 조회를 취소하고 늦은 응답을 무시한다", async () => {
  let resolve: (fields: TrainingField[]) => void = () => {
    throw new Error("요청 전")
  }
  vi.mocked(getAllTrainingFields)
    .mockReturnValueOnce(
      new Promise((done) => {
        resolve = done
      }),
    )
    .mockResolvedValueOnce([
      { trainingFieldId: 2, name: "최신 분야", isActive: true },
    ])
  const { result, rerender } = renderHook(
    ({ entry }) => useTrainingFields(true, 1, entry),
    { initialProps: { entry: 0 } },
  )
  const previousSignal = vi.mocked(getAllTrainingFields).mock.calls[0][0]
  rerender({ entry: 1 })
  expect(previousSignal?.aborted).toBe(true)
  await waitFor(() => expect(result.current.fields[0]?.name).toBe("최신 분야"))
  await act(async () => {
    resolve([{ trainingFieldId: 1, name: "오래된 분야", isActive: true }])
  })
  expect(result.current.fields[0]?.name).toBe("최신 분야")
  expect(getAllTrainingFields).toHaveBeenCalledTimes(2)
})
