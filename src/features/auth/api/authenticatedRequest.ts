import { ApiError, requestJson } from "@/lib/api/http"
import {
  clearSession,
  getGeneration,
  getSnapshot,
  getTokens,
  refreshSession,
} from "@/features/auth/model/auth.session"

// 보호 API의 401에만 재발급을 적용하며 같은 요청은 한 번만 재시도합니다.
export async function authenticatedRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const original = getTokens()
  if (
    !original ||
    getSnapshot().status !== "authenticated" ||
    getSnapshot().loggingOut
  )
    throw new ApiError(401, "로그인이 필요합니다.")
  const ticket = getGeneration()
  const send = (accessToken: string) => {
    const headers = new Headers(init.headers)
    headers.set("Authorization", `Bearer ${accessToken}`)
    return requestJson<T>(path, { ...init, headers })
  }
  try {
    const data = await send(original.accessToken)
    if (ticket !== getGeneration() || getSnapshot().loggingOut)
      throw new ApiError(401, "종료된 세션입니다.")
    return data
  } catch (error) {
    if (
      !(error instanceof ApiError) ||
      error.httpStatus !== 401 ||
      ticket !== getGeneration() ||
      getSnapshot().loggingOut
    )
      throw error
    // 다른 요청이 먼저 재발급했다면 이미 교체된 토큰을 사용합니다.
    const current = getTokens()
    const renewed =
      current && current !== original
        ? current
        : await refreshSession()
    if (ticket !== getGeneration() || getSnapshot().loggingOut)
      throw new ApiError(401, "종료된 세션입니다.")
    try {
      const data = await send(renewed.accessToken)
      if (ticket !== getGeneration() || getSnapshot().loggingOut)
        throw new ApiError(401, "종료된 세션입니다.")
      return data
    } catch (retryError) {
      if (
        ticket === getGeneration() &&
        retryError instanceof ApiError &&
        retryError.httpStatus === 401
      )
        clearSession("세션이 만료되었습니다. 다시 로그인해 주세요.")
      throw retryError
    }
  }
}
