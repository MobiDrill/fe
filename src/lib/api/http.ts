import type { GlobalResponse } from "@/features/auth/model/auth.types"

export class ApiError extends Error {
  constructor(
    public httpStatus: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "요청을 처리하지 못했습니다. 다시 시도해 주세요."
}

export async function requestJson<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set("Accept", "application/json")
  if (init.body instanceof FormData) headers.delete("Content-Type")
  else if (init.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json")
  const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "")
  let response: Response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
      signal: init.signal ?? AbortSignal.timeout(15000),
    })
  } catch {
    throw new ApiError(
      0,
      "서버에 연결하지 못했습니다. 연결 상태를 확인하고 다시 시도해 주세요.",
    )
  }
  let body: Partial<GlobalResponse<T>> | null = null
  try {
    body = await response.json()
  } catch {
    /* 비 JSON 오류 응답에도 HTTP 상태를 유지합니다. */
  }
  if (!response.ok) {
    const fallback: Record<number, string> = {
      400: "입력한 정보를 확인해 주세요.",
      401: "인증 정보가 유효하지 않습니다.",
      403: "접근할 수 없는 계정입니다.",
      409: "이미 가입된 이메일입니다.",
      503: "서버를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.",
    }
    throw new ApiError(
      response.status,
      typeof body?.message === "string"
        ? body.message
        : (fallback[response.status] ?? "요청을 처리하지 못했습니다."),
    )
  }
  if (
    !body ||
    typeof body !== "object" ||
    typeof body.status !== "number" ||
    !("data" in body)
  ) {
    throw new ApiError(502, "서버 응답 형식이 올바르지 않습니다.")
  }
  return body.data as T
}
