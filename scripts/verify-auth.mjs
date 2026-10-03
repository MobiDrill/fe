import assert from "node:assert/strict"
import { randomUUID } from "node:crypto"

// 실행마다 example.com 테스트 계정 하나를 생성합니다. 토큰과 비밀번호는 출력하지 않습니다.
const baseUrl = process.env.AUTH_API_URL ?? "http://localhost:5173"
const email = `auth-check-${randomUUID()}@example.com`
const password = `Test-${randomUUID()}`
async function request(path, body, accessToken) {
  const response = await fetch(`${baseUrl}/api/v1/auth${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  })
  return { status: response.status, body: await response.json() }
}
let tokens
try {
  const signup = {
    name: "인증연결테스트",
    email,
    password,
    passwordConfirm: password,
  }
  assert.equal(
    (await request("/register/email", signup)).status,
    201,
    "회원가입 201",
  )
  assert.equal(
    (await request("/register/email", signup)).status,
    409,
    "중복 이메일 409",
  )
  assert.equal(
    (await request("/login/email", { email, password: "WrongPassword123" }))
      .status,
    401,
    "잘못된 비밀번호 401",
  )
  const login = await request("/login/email", { email, password })
  assert.equal(login.status, 200, "로그인 200")
  assert.equal(login.body.data.name, signup.name)
  tokens = login.body.data
  assert.ok(tokens.accessToken && tokens.refreshToken, "로그인 토큰 쌍")
  const renewed = await request("/refresh", {
    refreshToken: tokens.refreshToken,
  })
  assert.equal(renewed.status, 200, "재발급 200")
  assert.ok(renewed.body.data.accessToken && renewed.body.data.refreshToken)
  tokens = renewed.body.data
  const logout = await request(
    "/logout",
    { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken },
    tokens.accessToken,
  )
  assert.equal(logout.status, 200, "로그아웃 200")
  const revoked = await request("/refresh", {
    refreshToken: tokens.refreshToken,
  })
  assert.equal(revoked.status, 401, "로그아웃 토큰 재사용 거부 401")
  tokens = undefined
  console.log(
    "실서버 인증 검증 통과: 회원가입, 중복 이메일, 로그인 실패/성공, 재발급, 로그아웃, 폐기 토큰 거부",
  )
} finally {
  if (tokens) {
    await request(
      "/logout",
      { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken },
      tokens.accessToken,
    ).catch(() => {})
  }
}
