import { authenticatedRequest } from "@/features/auth/api/authenticatedRequest"
import { ApiError } from "@/lib/api/http"

export type TrainingField = {
  trainingFieldId: number
  name: string
  isActive: boolean
}
export type TrainingFieldInput = Pick<TrainingField, "name" | "isActive">
export type TrainingFieldPage = {
  content: TrainingField[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  nextCursor: number | null
}
const root = "/api/v1/training-fields"

export async function getTrainingFields(
  page = 1,
  size = 100,
  signal?: AbortSignal,
) {
  return authenticatedRequest<TrainingFieldPage>(
    `${root}?page=${page}&size=${size}`,
    {
      signal: signal
        ? AbortSignal.any([signal, AbortSignal.timeout(15000)])
        : undefined,
    },
  )
}

// 전체 목록을 읽어 관리 화면의 검색과 교범 등록 선택에서 같은 데이터를 사용합니다.
export async function getAllTrainingFields(
  signal?: AbortSignal,
): Promise<TrainingField[]> {
  const fields: TrainingField[] = []
  for (let page = 1; ; page++) {
    const result = await getTrainingFields(page, 100, signal)
    if (
      !result ||
      !Array.isArray(result.content) ||
      result.page !== page ||
      typeof result.hasNext !== "boolean" ||
      (result.hasNext && !result.content.length)
    )
      throw new ApiError(502, "훈련 분야 목록 응답이 올바르지 않습니다.")
    fields.push(...result.content)
    if (!result.hasNext) return fields
  }
}
export function createTrainingField(input: TrainingFieldInput) {
  return authenticatedRequest<TrainingField>(root, {
    method: "POST",
    body: JSON.stringify(input),
  })
}
export function updateTrainingField(id: number, input: TrainingFieldInput) {
  return authenticatedRequest<TrainingField>(`${root}/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  })
}
export async function deleteTrainingField(id: number): Promise<void> {
  await authenticatedRequest<null>(`${root}/${id}`, { method: "DELETE" })
}
