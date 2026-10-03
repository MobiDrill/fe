import { ApiError, requestJson } from "@/lib/api/http"
import type {
  AuthLoginEmailReqDto,
  AuthLoginEmailResDto,
  AuthLogoutReqDto,
  AuthRefreshTokenReqDto,
  AuthRefreshTokenResDto,
  AuthRegisterEmailReqDto,
} from "@/features/auth/model/auth.types"

const root = "/api/v1/auth"
const post = <T>(path: string, body: unknown, headers?: HeadersInit) =>
  requestJson<T>(`${root}${path}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  })

function validateTokens(data: AuthRefreshTokenResDto): AuthRefreshTokenResDto {
  if (
    !data ||
    typeof data.accessToken !== "string" ||
    !data.accessToken ||
    typeof data.refreshToken !== "string" ||
    !data.refreshToken
  ) {
    throw new ApiError(502, "서버의 토큰 응답이 올바르지 않습니다.")
  }
  return data
}

export async function registerEmail(
  request: AuthRegisterEmailReqDto,
): Promise<void> {
  await post<null>("/register/email", request)
}
export async function loginEmail(
  request: AuthLoginEmailReqDto,
): Promise<AuthLoginEmailResDto> {
  const data = await post<AuthLoginEmailResDto>("/login/email", request)
  validateTokens(data)
  if (
    !Number.isSafeInteger(data.userId) ||
    typeof data.email !== "string" ||
    !data.email ||
    typeof data.name !== "string" ||
    !data.name
  ) {
    throw new ApiError(502, "서버의 사용자 응답이 올바르지 않습니다.")
  }
  return data
}
export async function refreshToken(
  request: AuthRefreshTokenReqDto,
): Promise<AuthRefreshTokenResDto> {
  return validateTokens(await post<AuthRefreshTokenResDto>("/refresh", request))
}
export async function logout(request: AuthLogoutReqDto): Promise<void> {
  await post<null>("/logout", request, {
    Authorization: `Bearer ${request.accessToken}`,
  })
}
