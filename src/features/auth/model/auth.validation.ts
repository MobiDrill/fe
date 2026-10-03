import type {
  AuthLoginEmailReqDto,
  AuthRegisterEmailReqDto,
} from "./auth.types"

export function validateLogin(input: AuthLoginEmailReqDto): string {
  if (
    !input.email.trim() ||
    input.email.length > 255 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)
  )
    return "올바른 이메일을 입력해 주세요."
  if (!input.password) return "비밀번호를 입력해 주세요."
  if (new TextEncoder().encode(input.password).length > 72)
    return "비밀번호는 UTF-8 기준 72바이트 이하여야 합니다."
  return ""
}

export function validateSignup(input: AuthRegisterEmailReqDto): string {
  if (!input.name.trim() || input.name.length > 30)
    return "이름은 1~30자로 입력해 주세요."
  const loginError = validateLogin(input)
  if (loginError) return loginError
  for (const password of [input.password, input.passwordConfirm]) {
    if (password.length < 8 || password.length > 64)
      return "비밀번호는 8~64자로 입력해 주세요."
    if (new TextEncoder().encode(password).length > 72)
      return "비밀번호는 UTF-8 기준 72바이트 이하여야 합니다."
  }
  if (input.password !== input.passwordConfirm)
    return "비밀번호가 일치하지 않습니다. 다시 확인해 주세요."
  return ""
}
