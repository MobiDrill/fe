import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeAll, beforeEach, expect, it, vi } from "vitest"
import App from "@/App"
import { authenticatedRequest } from "@/features/auth/api/authenticatedRequest"
import type { TrainingField } from "../api/trainingFields.api"

vi.mock("@/features/auth/context/AuthProvider", () => ({
  useAuth: () => ({
    status: "authenticated",
    user: { userId: 1, name: "관리자" },
    logout: vi.fn(),
  }),
}))
vi.mock("@/features/auth/api/authenticatedRequest", () => ({
  authenticatedRequest: vi.fn(),
}))
const request = vi.mocked(authenticatedRequest)
let fields: TrainingField[]
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "")
  }
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open")
  }
})
beforeEach(() => {
  window.location.hash = "/training-fields"
  fields = [
    { trainingFieldId: 2, name: "사격", isActive: true },
    { trainingFieldId: 1, name: "통신", isActive: false },
  ]
  request.mockReset()
  request.mockImplementation(async (path, init) => {
    if (!init?.method) return { content: [...fields], page: 1, hasNext: false }
    if (init.method === "POST") {
      const field = { trainingFieldId: 3, ...JSON.parse(init.body as string) }
      fields = [field, ...fields]
      return field
    }
    const id = Number(path.split("/").pop())
    if (init.method === "PUT") {
      const field = { trainingFieldId: id, ...JSON.parse(init.body as string) }
      fields = fields.map((old) => (old.trainingFieldId === id ? field : old))
      return field
    }
    if (init.method === "DELETE") {
      fields = fields.filter((field) => field.trainingFieldId !== id)
      return null
    }
  })
})
afterEach(() => {
  cleanup()
  window.location.hash = ""
})
const ready = () => screen.findByRole("rowheader", { name: "사격" })

it(
  "서버 조회·등록·수정·삭제를 요청하고 다시 진입하면 서버 목록을 조회한다",
  { timeout: 15000 },
  async () => {
    const user = userEvent.setup()
    const first = render(<App />)
    await ready()
    expect(request).toHaveBeenCalledWith(
      "/api/v1/training-fields?page=1&size=100",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    await user.click(screen.getByRole("button", { name: "훈련 분야 등록" }))
    await user.type(screen.getByLabelText(/분야명/), "통신 훈련")
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "등록" }),
    )
    expect(
      await screen.findByRole("rowheader", { name: "통신 훈련" }),
    ).toBeTruthy()
    expect(request).toHaveBeenCalledWith("/api/v1/training-fields", {
      method: "POST",
      body: JSON.stringify({ name: "통신 훈련", isActive: true }),
    })
    await user.click(screen.getByRole("button", { name: "통신 훈련 수정" }))
    await user.clear(screen.getByLabelText(/분야명/))
    await user.type(screen.getByLabelText(/분야명/), "장비 훈련")
    await user.click(screen.getByLabelText("활성 분야"))
    await user.click(screen.getByRole("button", { name: "수정 저장" }))
    await screen.findByRole("rowheader", { name: "장비 훈련" })
    expect(request).toHaveBeenCalledWith("/api/v1/training-fields/3", {
      method: "PUT",
      body: JSON.stringify({ name: "장비 훈련", isActive: false }),
    })
    first.unmount()
    render(<App />)
    await screen.findByRole("rowheader", { name: "장비 훈련" })
    await user.click(screen.getByRole("button", { name: "장비 훈련 삭제" }))
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "취소" }),
    )
    expect(screen.getByRole("rowheader", { name: "장비 훈련" })).toBeTruthy()
    await user.click(screen.getByRole("button", { name: "장비 훈련 삭제" }))
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "삭제" }),
    )
    await waitFor(() =>
      expect(screen.queryByRole("rowheader", { name: "장비 훈련" })).toBeNull(),
    )
    expect(request).toHaveBeenCalledWith("/api/v1/training-fields/3", {
      method: "DELETE",
    })
  },
)

it("이름 공백을 거부하고 교범이 있는 분야도 삭제할 수 있다", async () => {
  const user = userEvent.setup()
  render(<App />)
  await ready()
  expect(
    (screen.getByRole("button", { name: "사격 삭제" }) as HTMLButtonElement)
      .disabled,
  ).toBe(false)
  await user.click(screen.getByRole("button", { name: "훈련 분야 등록" }))
  await user.type(screen.getByLabelText(/분야명/), "   ")
  await user.click(
    within(screen.getByRole("dialog")).getByRole("button", { name: "등록" }),
  )
  expect(screen.getByRole("alert").textContent).toContain("1~100자")
  expect(
    request.mock.calls.filter(([, init]) => init?.method === "POST"),
  ).toHaveLength(0)
  await user.click(
    within(screen.getByRole("dialog")).getByRole("button", { name: "취소" }),
  )
  await user.click(screen.getByRole("button", { name: "사격 삭제" }))
  expect(screen.getByText(/교범과 원본 파일은 보존됩니다/)).toBeTruthy()
  await user.click(
    within(screen.getByRole("dialog")).getByRole("button", { name: "삭제" }),
  )
  await waitFor(() =>
    expect(screen.queryByRole("rowheader", { name: "사격" })).toBeNull(),
  )
})

it("수정한 서버 분야와 ID는 교범 등록 선택에 반영하고 비활성 분야는 제외한다", async () => {
  const user = userEvent.setup()
  render(<App />)
  await ready()
  await user.click(screen.getByRole("button", { name: "사격 수정" }))
  await user.clear(screen.getByLabelText(/분야명/))
  await user.type(screen.getByLabelText(/분야명/), "기본 사격")
  await user.click(screen.getByRole("button", { name: "수정 저장" }))
  await screen.findByRole("rowheader", { name: "기본 사격" })
  await user.click(screen.getByRole("button", { name: /교범 관리/ }))
  await user.click(screen.getByRole("button", { name: "교범 등록" }))
  const select = screen.getByRole("combobox", { name: /훈련 분야/ })
  expect(
    await within(select).findByRole("option", { name: "기본 사격" }),
  ).toBeTruthy()
  expect(within(select).queryByRole("option", { name: "통신" })).toBeNull()
  await user.selectOptions(select, "2")
  expect((select as HTMLSelectElement).value).toBe("2")
})

it("조회 권한 오류를 표시하고 재시도로 서버 목록을 불러온다", async () => {
  request.mockRejectedValueOnce(new Error("관리자 권한이 필요합니다."))
  render(<App />)
  expect((await screen.findByRole("alert")).textContent).toContain(
    "관리자 권한",
  )
  expect(screen.queryByRole("rowheader", { name: "사격" })).toBeNull()
  await userEvent.click(screen.getByRole("button", { name: "다시 시도" }))
  await ready()
})

it.each(["POST", "PUT", "DELETE"])(
  "%s 실패 시 기존 목록과 대화상자를 유지한다",
  async (method) => {
    const user = userEvent.setup()
    render(<App />)
    await ready()
    request.mockRejectedValueOnce(new Error("서버 처리에 실패했습니다."))
    if (method === "POST") {
      await user.click(screen.getByRole("button", { name: "훈련 분야 등록" }))
      await user.type(screen.getByLabelText(/분야명/), "새 분야")
      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: "등록",
        }),
      )
    } else if (method === "PUT") {
      await user.click(screen.getByRole("button", { name: "사격 수정" }))
      fireEvent.change(screen.getByLabelText(/분야명/), {
        target: { value: "수정 분야" },
      })
      await user.click(screen.getByRole("button", { name: "수정 저장" }))
    } else {
      await user.click(screen.getByRole("button", { name: "사격 삭제" }))
      await user.click(
        within(screen.getByRole("dialog")).getByRole("button", {
          name: "삭제",
        }),
      )
    }
    expect((await screen.findByRole("alert")).textContent).toContain(
      "서버 처리",
    )
    expect(screen.getByRole("dialog")).toBeTruthy()
    expect(screen.getByRole("rowheader", { name: "사격" })).toBeTruthy()
    expect(screen.queryByRole("rowheader", { name: "새 분야" })).toBeNull()
    expect(screen.queryByRole("rowheader", { name: "수정 분야" })).toBeNull()
  },
)

it("등록 응답 전에는 목록을 변경하지 않고 중복 제출을 막는다", async () => {
  render(<App />)
  await ready()
  let resolve: (value: TrainingField) => void = () => {
    throw new Error("요청 전")
  }
  request.mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done
      }),
  )
  const user = userEvent.setup()
  await user.click(screen.getByRole("button", { name: "훈련 분야 등록" }))
  await user.type(screen.getByLabelText(/분야명/), "새 분야")
  await user.click(
    within(screen.getByRole("dialog")).getByRole("button", { name: "등록" }),
  )
  const button = screen.getByRole("button", {
    name: "저장 중…",
  }) as HTMLButtonElement
  expect(button.disabled).toBe(true)
  await user.click(button)
  expect(
    request.mock.calls.filter(([, init]) => init?.method === "POST"),
  ).toHaveLength(1)
  expect(screen.queryByRole("rowheader", { name: "새 분야" })).toBeNull()
  resolve({ trainingFieldId: 3, name: "새 분야", isActive: true })
  await screen.findByRole("rowheader", { name: "새 분야" })
})

it(
  "페이지 진입·재진입마다 전체 페이지를 다시 조회하고 최신 분야명을 표시한다",
  { timeout: 15000 },
  async () => {
    const user = userEvent.setup()
    let name = "첫 분야"
    request.mockImplementation(async (path) => {
      const page = Number(
        new URL(path, "http://localhost").searchParams.get("page"),
      )
      return {
        content: [
          {
            trainingFieldId: page,
            name: page === 1 ? name : "마지막 분야",
            isActive: true,
          },
        ],
        page,
        hasNext: page === 1,
      }
    })
    const listCalls = () =>
      request.mock.calls.filter(([path]) => path.includes("?page="))
    render(<App />)
    await screen.findByRole("rowheader", { name: "첫 분야" })
    expect(screen.getByRole("rowheader", { name: "마지막 분야" })).toBeTruthy()
    expect(listCalls().map(([path]) => path)).toEqual([
      "/api/v1/training-fields?page=1&size=100",
      "/api/v1/training-fields?page=2&size=100",
    ])
    name = "교범 진입 분야"
    await user.click(screen.getByRole("button", { name: /교범 관리/ }))
    await waitFor(() => expect(listCalls()).toHaveLength(4))
    await user.click(screen.getByRole("button", { name: "전체 분야" }))
    expect(
      await screen.findByRole("button", { name: "교범 진입 분야" }),
    ).toBeTruthy()
    name = "다시 조회한 분야"
    await user.click(screen.getByRole("button", { name: "훈련 분야 관리" }))
    await screen.findByRole("rowheader", { name: "다시 조회한 분야" })
    expect(listCalls()).toHaveLength(6)
    name = "같은 메뉴 재진입 분야"
    await user.click(screen.getByRole("button", { name: "훈련 분야 관리" }))
    await screen.findByRole("rowheader", { name: "같은 메뉴 재진입 분야" })
    expect(listCalls()).toHaveLength(8)
    await user.click(screen.getByRole("button", { name: /교범 관리/ }))
    await waitFor(() => expect(listCalls()).toHaveLength(10))
    await user.click(screen.getByRole("button", { name: "교범 등록" }))
    name = "목록 복귀 분야"
    await user.click(
      screen.getByRole("button", { name: "교범 관리로 돌아가기" }),
    )
    await waitFor(() => expect(listCalls()).toHaveLength(12))
    await user.click(screen.getByRole("button", { name: "전체 분야" }))
    expect(
      await screen.findByRole("button", { name: "목록 복귀 분야" }),
    ).toBeTruthy()
  },
)
