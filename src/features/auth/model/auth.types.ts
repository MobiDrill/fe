export type AuthRegisterEmailReqDto = {
  name: string
  email: string
  password: string
  passwordConfirm: string
}
export type AuthLoginEmailReqDto = {
  email: string
  password: string
}
export type AuthRefreshTokenReqDto = { refreshToken: string }
export type AuthLogoutReqDto = {
  accessToken: string
  refreshToken: string
}
export type AuthRefreshTokenResDto = AuthLogoutReqDto
export type AuthUser = {
  userId: number
  email: string
  name: string
}
export type AuthLoginEmailResDto = AuthUser & AuthRefreshTokenResDto
export type AuthStatus = "initializing" | "anonymous" | "authenticated"
export type GlobalResponse<T> = {
  status: number
  message: string
  data: T
}
