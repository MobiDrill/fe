import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, expect, it, vi } from "vitest"
import ManualRegistrationPage from "./ManualRegistrationPage"
import { registerManual } from "../api/manuals.api"

vi.mock("../api/manuals.api", async (original) => ({
  ...(await original<typeof import("../api/manuals.api")>()),
  registerManual: vi.fn(),
}))
afterEach(() => {
  cleanup()
  vi.mocked(registerManual).mockReset()
})

async function fill() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText(/교범명/), "새 교범")
  await user.selectOptions(screen.getByLabelText(/훈련 분야/), "3")
  await user.type(screen.getByLabelText("교범 설명"), "훈련용")
  await user.upload(
    screen.getByLabelText("교범 원본 파일"),
    new File(["%PDF-1.7"], "test.pdf"),
  )
  return user
}

it("필수값 누락과 파일 형식·용량 오류는 제출하지 않는다", async () => {
  render(
    <ManualRegistrationPage
      trainingFields={[{ trainingFieldId: 3, name: "사격", isActive: true }]}
      onBack={vi.fn()}
      onSave={vi.fn()}
    />,
  )
  await userEvent.click(screen.getByRole("button", { name: "저장" }))
  expect(screen.getByRole("alert").textContent).toContain("교범명")
  const input = screen.getByLabelText("교범 원본 파일")
  fireEvent.change(input, {
    target: { files: [new File(["text"], "invalid.txt")] },
  })
  expect(screen.getByRole("alert").textContent).toContain("HWP 5")
  const large = new File(["%PDF"], "large.pdf")
  Object.defineProperty(large, "size", { value: 50 * 1024 * 1024 + 1 })
  fireEvent.change(input, { target: { files: [large] } })
  expect(screen.getByRole("alert").textContent).toContain("50MB")
  expect(registerManual).not.toHaveBeenCalled()
})

it("중복 제출을 막고 성공 응답을 받은 뒤에만 이동한다", async () => {
  let resolve: (value: Awaited<ReturnType<typeof registerManual>>) => void =
    () => {
      throw new Error("등록 요청이 시작되지 않았습니다.")
    }
  vi.mocked(registerManual).mockReturnValue(
    new Promise((done) => {
      resolve = done
    }),
  )
  const onSave = vi.fn()
  render(
    <ManualRegistrationPage
      trainingFields={[{ trainingFieldId: 3, name: "사격", isActive: true }]}
      onBack={vi.fn()}
      onSave={onSave}
    />,
  )
  const user = await fill()
  await user.click(screen.getByRole("button", { name: "저장" }))
  const submitting = screen.getByRole("button", {
    name: "등록 중…",
  }) as HTMLButtonElement
  expect(submitting.disabled).toBe(true)
  await user.click(submitting)
  expect(registerManual).toHaveBeenCalledTimes(1)
  expect(registerManual).toHaveBeenCalledWith(
    { manualTitle: "새 교범", trainingFieldId: 3, manualDescription: "훈련용" },
    expect.any(File),
  )
  expect(onSave).not.toHaveBeenCalled()
  const result = { manualId: 1 } as Awaited<ReturnType<typeof registerManual>>
  resolve(result)
  await waitFor(() => expect(onSave).toHaveBeenCalledWith(result))
})

it("권한 오류를 표시하고 입력을 유지해 다시 제출할 수 있다", async () => {
  vi.mocked(registerManual).mockRejectedValue(
    new Error("관리자 권한이 필요합니다."),
  )
  const onSave = vi.fn()
  render(
    <ManualRegistrationPage
      trainingFields={[{ trainingFieldId: 3, name: "사격", isActive: true }]}
      onBack={vi.fn()}
      onSave={onSave}
    />,
  )
  const user = await fill()
  await user.click(screen.getByRole("button", { name: "저장" }))
  expect((await screen.findByRole("alert")).textContent).toContain(
    "관리자 권한",
  )
  expect((screen.getByLabelText(/교범명/) as HTMLInputElement).value).toBe(
    "새 교범",
  )
  expect(screen.getByText(/test.pdf/)).toBeTruthy()
  expect(
    (screen.getByRole("button", { name: "저장" }) as HTMLButtonElement)
      .disabled,
  ).toBe(false)
  expect(onSave).not.toHaveBeenCalled()
})
