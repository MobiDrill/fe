import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import App from "./App"

const state = vi.hoisted(() => ({
  status: "anonymous",
  user: null as { name: string } | null,
  message: "",
  loggingOut: false,
  logout: vi.fn(),
}))
vi.mock("./features/auth/context/AuthProvider", () => ({
  useAuth: () => state,
}))
afterEach(() => {
  cleanup()
  window.location.hash = ""
  state.status = "anonymous"
  state.user = null
})
it("미인증 상태에서 교범 화면에 직접 접근하면 로그인으로 이동한다", () => {
  window.location.hash = "/manuals"
  render(<App />)
  expect(screen.getByRole("heading", { name: "로그인" })).toBeTruthy()
  expect(screen.queryByText("교범 관리")).toBeNull()
  expect(window.location.hash).toBe("#/login")
})
it("인증 후 기존 교범 목록과 로그인 사용자 이름을 표시한다", () => {
  state.status = "authenticated"
  state.user = { name: "실제사용자" }
  window.location.hash = "/manuals"
  render(<App />)
  expect(screen.getAllByText("교범 관리").length).toBeGreaterThan(0)
  expect(screen.getAllByText("실제사용자").length).toBeGreaterThan(0)
  expect(screen.getByRole("button", { name: "로그아웃" })).toBeTruthy()
})
