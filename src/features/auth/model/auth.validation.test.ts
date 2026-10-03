import { describe, expect, it } from "vitest"
import { validateLogin, validateSignup } from "./auth.validation"

const valid = {
  name: "사용자",
  email: "test@example.com",
  password: "12345678",
  passwordConfirm: "12345678",
}
describe("인증 입력 검증", () => {
  it.each([7, 65])("가입 비밀번호 %i자를 거부한다", (length) => {
    const password = "a".repeat(length)
    expect(
      validateSignup({ ...valid, password, passwordConfirm: password }),
    ).not.toBe("")
  })
  it.each([8, 64])("가입 비밀번호 %i자를 허용한다", (length) => {
    const password = "a".repeat(length)
    expect(
      validateSignup({ ...valid, password, passwordConfirm: password }),
    ).toBe("")
  })
  it("UTF-8 72바이트는 허용하고 73바이트는 거부한다", () => {
    expect(
      validateLogin({ email: valid.email, password: "가".repeat(24) }),
    ).toBe("")
    expect(
      validateLogin({ email: valid.email, password: "가".repeat(24) + "a" }),
    ).toContain("72바이트")
  })
  it("공백 이름, 긴 이름, 잘못된 이메일, 확인 불일치를 거부한다", () => {
    expect(validateSignup({ ...valid, name: "   " })).not.toBe("")
    expect(validateSignup({ ...valid, name: "a".repeat(31) })).not.toBe("")
    expect(validateSignup({ ...valid, email: "invalid" })).not.toBe("")
    expect(validateSignup({ ...valid, passwordConfirm: "87654321" })).toContain(
      "일치",
    )
  })
  it("로그인 비밀번호에 가입의 8자 제한을 적용하지 않는다", () => {
    expect(validateLogin({ email: valid.email, password: "a" })).toBe("")
  })
})
