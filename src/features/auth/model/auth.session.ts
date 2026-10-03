import * as api from "@/features/auth/api/auth.api"
import { ApiError, errorMessage } from "@/lib/api/http"
import type {
  AuthLoginEmailReqDto,
  AuthLogoutReqDto,
  AuthStatus,
  AuthUser,
} from "./auth.types"

const storageKey = "mobidrill.auth.session"
type Snapshot = {
  status: AuthStatus
  user: AuthUser | null
  restoreError: string
  loggingOut: boolean
  message: string
}
let snapshot: Snapshot = {
  status: "initializing",
  user: null,
  restoreError: "",
  loggingOut: false,
  message: "",
}
let tokens: AuthLogoutReqDto | null = null
let generation = 0
let refreshPromise: Promise<AuthLogoutReqDto> | null = null
let restorePromise: Promise<void> | null = null
let logoutPromise: Promise<void> | null = null
const listeners = new Set<() => void>()

export const getSnapshot = () => snapshot
export const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
export const getTokens = () => tokens
export const getGeneration = () => generation
function publish(update: Partial<Snapshot>) {
  snapshot = { ...snapshot, ...update }
  listeners.forEach((listener) => listener())
}
function persist(user: AuthUser, refreshToken: string) {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify({ user, refreshToken }))
  } catch {
    /* 저장이 제한되면 메모리 세션만 사용합니다. */
  }
}
export function clearSession(message = "") {
  generation++
  tokens = null
  try {
    sessionStorage.removeItem(storageKey)
  } catch {
    /* 저장소 접근이 차단된 환경을 지원합니다. */
  }
  publish({ status: "anonymous", user: null, restoreError: "", message })
}
function expired(error: unknown) {
  return error instanceof ApiError && [400, 401, 403].includes(error.httpStatus)
}

export async function login(request: AuthLoginEmailReqDto) {
  if (snapshot.loggingOut)
    throw new ApiError(0, "로그아웃이 완료된 후 다시 시도해 주세요.")
  const ticket = ++generation
  const result = await api.loginEmail(request)
  if (ticket !== generation || snapshot.loggingOut)
    throw new ApiError(0, "취소된 로그인 요청입니다.")
  const user = { userId: result.userId, email: result.email, name: result.name }
  tokens = {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  }
  persist(user, result.refreshToken)
  publish({ status: "authenticated", user, restoreError: "", message: "" })
}

export function refreshSession(allowLogout = false): Promise<AuthLogoutReqDto> {
  if (refreshPromise) return refreshPromise
  if (!tokens || (snapshot.loggingOut && !allowLogout))
    return Promise.reject(new ApiError(401, "로그인이 필요합니다."))
  const ticket = generation
  const refreshToken = tokens.refreshToken
  const task = (async () => {
    try {
      const result = await api.refreshToken({ refreshToken })
      if (ticket !== generation) throw new ApiError(401, "종료된 세션입니다.")
      tokens = result
      if (snapshot.user) persist(snapshot.user, result.refreshToken)
      return result
    } catch (error) {
      if (ticket === generation && expired(error))
        clearSession("세션이 만료되었습니다. 다시 로그인해 주세요.")
      throw error
    }
  })()
  refreshPromise = task
  void task
    .finally(() => {
      if (refreshPromise === task) refreshPromise = null
    })
    .catch(() => {})
  return task
}

export function restoreSession(): Promise<void> {
  if (restorePromise) return restorePromise
  if (snapshot.status !== "initializing") return Promise.resolve()
  const ticket = generation
  const task = (async () => {
    let saved: {
      user: AuthUser
      refreshToken: string
    }
    try {
      const raw = sessionStorage.getItem(storageKey)
      if (!raw) {
        clearSession()
        return
      }
      saved = JSON.parse(raw)
      if (
        !saved ||
        typeof saved.refreshToken !== "string" ||
        !saved.refreshToken ||
        !saved.user ||
        !Number.isSafeInteger(saved.user.userId) ||
        typeof saved.user.name !== "string" ||
        typeof saved.user.email !== "string"
      )
        throw new Error()
    } catch {
      clearSession()
      return
    }
    tokens = { accessToken: "", refreshToken: saved.refreshToken }
    publish({ user: saved.user, restoreError: "" })
    try {
      await refreshSession()
      if (generation === ticket) publish({ status: "authenticated" })
    } catch (error) {
      if (generation === ticket) publish({ restoreError: errorMessage(error) })
    }
  })()
  restorePromise = task
  void task
    .finally(() => {
      if (restorePromise === task) restorePromise = null
    })
    .catch(() => {})
  return task
}

export function logout(): Promise<void> {
  if (logoutPromise) return logoutPromise
  publish({ loggingOut: true })
  const task = (async () => {
    let message = "로그아웃되었습니다."
    try {
      if (refreshPromise) await refreshPromise
      if (tokens) {
        try {
          await api.logout(tokens)
        } catch (error) {
          if (!(error instanceof ApiError) || error.httpStatus !== 401)
            throw error
          const refreshed = await refreshSession(true)
          await api.logout(refreshed)
        }
      }
    } catch {
      message =
        "이 기기에서는 로그아웃했지만 서버 세션 종료는 확인하지 못했습니다."
    } finally {
      clearSession(message)
      publish({ loggingOut: false })
    }
  })()
  logoutPromise = task
  void task
    .finally(() => {
      if (logoutPromise === task) logoutPromise = null
    })
    .catch(() => {})
  return task
}
