import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import LoginPage from "./LoginPage"
import SignupPage from "./SignupPage"
import userEvent from "@testing-library/user-event"

const auth = vi.hoisted(() => ({ login: vi.fn(), register: vi.fn() }))
vi.mock("../context/AuthProvider", () => ({ useAuth: () => auth }))
beforeEach(() => {
  auth.login.mockReset()
  auth.register.mockReset()
})
afterEach(cleanup)
const fillLogin = () => {
  fireEvent.change(screen.getByLabelText("이메일"), {
    target: { value: "test@example.com" },
  })
  fireEvent.change(screen.getByLabelText("비밀번호", { exact: true }), {
    target: { value: "12345678" },
  })
}
const fillSignup = () => {
  fillLogin()
  fireEvent.change(screen.getByLabelText("이름"), {
    target: { value: "테스트" },
  })
  fireEvent.change(screen.getByLabelText("비밀번호 확인", { exact: true }), {
    target: { value: "12345678" },
  })
}
describe("인증 폼", () => {
  it("비밀번호 보기 버튼을 키보드로 조작할 수 있다", async () => {
    const user = userEvent.setup()
    render(<LoginPage email="" registered={false} message="" onLogin={vi.fn()} />)
    const input = screen.getByLabelText("비밀번호", { exact: true })
    const toggle = screen.getByRole("button", { name: "비밀번호 보기" })
    toggle.focus()
    await user.keyboard("{Enter}")
    expect(input.getAttribute("type")).toBe("text")
    await user.keyboard(" ")
    expect(input.getAttribute("type")).toBe("password")
  })
  it("로그인 성공 응답 후에만 화면을 이동하고 중복 제출을 차단한다", async () => {
    let complete: () => void = () => { throw new Error("Promise가 초기화되지 않았습니다.") }
    auth.login.mockReturnValue(
      new Promise<void>((resolve) => {
        complete = resolve
      }),
    )
    const onLogin = vi.fn()
    render(
      <LoginPage email="" registered={false} message="" onLogin={onLogin} />,
    )
    fillLogin()
    const form = screen
      .getByRole("button", { name: "로그인" })
      .closest("form")!
    fireEvent.submit(form)
    fireEvent.submit(form)
    expect(auth.login).toHaveBeenCalledTimes(1)
    expect(onLogin).not.toHaveBeenCalled()
    expect(screen.getByLabelText("이메일").closest("fieldset")?.disabled).toBe(
      true,
    )
    complete()
    await waitFor(() => expect(onLogin).toHaveBeenCalledTimes(1))
  })
  it("로그인 실패는 오류만 표시하고 이동하지 않는다", async () => {
    auth.login.mockRejectedValue(
      new Error("이메일 또는 비밀번호가 일치하지 않습니다."),
    )
    const onLogin = vi.fn()
    render(
      <LoginPage email="" registered={false} message="" onLogin={onLogin} />,
    )
    fillLogin()
    fireEvent.submit(
      screen
        .getByRole("button", { name: "로그인" })
        .closest("form")!,
    )
    expect(await screen.findByRole("alert")).toHaveProperty(
      "textContent",
      "이메일 또는 비밀번호가 일치하지 않습니다.",
    )
    expect(onLogin).not.toHaveBeenCalled()
  })
  it("가입 확인값을 passwordConfirm으로 전송하고 성공 후 이메일을 전달한다", async () => {
    auth.register.mockResolvedValue(undefined)
    const onSignup = vi.fn()
    render(<SignupPage onSignup={onSignup} />)
    fillSignup()
    fireEvent.submit(
      screen
        .getByRole("button", { name: "회원가입" })
        .closest("form")!,
    )
    await waitFor(() =>
      expect(onSignup).toHaveBeenCalledWith("test@example.com"),
    )
    expect(auth.register).toHaveBeenCalledWith({
      name: "테스트",
      email: "test@example.com",
      password: "12345678",
      passwordConfirm: "12345678",
    })
  })
  it("가입 409 실패는 화면 이동 없이 오류를 표시한다", async () => {
    auth.register.mockRejectedValue(new Error("이미 가입된 이메일입니다."))
    const onSignup = vi.fn()
    render(<SignupPage onSignup={onSignup} />)
    fillSignup()
    fireEvent.submit(
      screen
        .getByRole("button", { name: "회원가입" })
        .closest("form")!,
    )
    expect(await screen.findByRole("alert")).toHaveProperty(
      "textContent",
      "이미 가입된 이메일입니다.",
    )
    expect(onSignup).not.toHaveBeenCalled()
  })
  it("비밀번호 확인 불일치는 API 호출 전에 거부한다", () => {
    render(<SignupPage onSignup={vi.fn()} />)
    fillSignup()
    fireEvent.change(screen.getByLabelText("비밀번호 확인", { exact: true }), {
      target: { value: "different" },
    })
    fireEvent.submit(
      screen
        .getByRole("button", { name: "회원가입" })
        .closest("form")!,
    )
    expect(screen.getByRole("alert").textContent).toContain("일치하지")
    expect(auth.register).not.toHaveBeenCalled()
  })
})

