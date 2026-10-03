import { StrictMode } from "react"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import AuthProvider, { useAuth } from "./AuthProvider"

afterEach(() => {
  cleanup()
  sessionStorage.clear()
  vi.unstubAllGlobals()
})
function Status() {
  const auth = useAuth()
  return (
    <p>
      {auth.status}:{auth.user?.name}
    </p>
  )
}
it("StrictMode에서도 저장된 세션을 한 번만 재발급하고 사용자에게 반영한다", async () => {
  sessionStorage.setItem(
    "mobidrill.auth.session",
    JSON.stringify({
      user: { userId: 1, name: "테스트", email: "test@example.com" },
      refreshToken: "refresh",
    }),
  )
  const fetchMock = vi
    .fn()
    .mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 200,
          message: "ok",
          data: { accessToken: "access", refreshToken: "rotated" },
        }),
      ),
    )
  vi.stubGlobal("fetch", fetchMock)
  render(
    <StrictMode>
      <AuthProvider>
        <Status />
      </AuthProvider>
    </StrictMode>,
  )
  expect(await screen.findByText("authenticated:테스트")).toBeTruthy()
  expect(fetchMock).toHaveBeenCalledTimes(1)
})
