import { authenticatedRequest } from "@/features/auth/api/authenticatedRequest"

export const manualStatuses = {
  TEMPORARY_SAVED: "임시 저장",
  EXTRACTION_ONGOING: "추출 중",
  REVIEW_NEED: "검수 필요",
  REVIEW_ONGOING: "검수 중",
  QUESTION_GENERATION_NEED: "검수 완료",
  QUESTION_GENERATION_ONGOING: "문제 생성 중",
  QUESTION_REVIEW_NEED: "문제 검수 필요",
  QUESTION_REVIEW_ONGOING: "문제 검수 중",
  ABNORMAL_TERMINATION: "비정상 종료",
} as const

export type ManualApiStatus = keyof typeof manualStatuses
export type ManualListQuery = {
  trainingFieldId?: number
  sort: "LATEST" | "OLDEST"
  page: number
  size: number
  manualTitle?: string
  manualStatus?: ManualApiStatus
}
export type ManualListItem = {
  manualId: number
  manualTitle: string
  fileType: "PDF" | "PPT" | "HWP" | "WORD" | null
  registeredByName: string | null
  trainingField: {
    id: number | null
    name: string | null
  } | null
  manualStatus: ManualApiStatus
  updatedAt: string | null
}
export type ManualListMetadata = {
  totalManualCount: number
  extractionOngoingCount: number
  reviewNeedCount: number
  questionGenerationOngoingCount: number
  questionReviewNeedCount: number
}
export type ManualListResponse = {
  metadata: ManualListMetadata
  manuals: {
    content: ManualListItem[]
    page: number
    size: number
    totalElements: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
    nextCursor: null
  }
}

export function getManuals(query: ManualListQuery, signal?: AbortSignal) {
  const params = new URLSearchParams({
    sort: query.sort,
    page: String(query.page),
    size: String(query.size),
  })
  if (query.trainingFieldId !== undefined)
    params.set("trainingFieldId", String(query.trainingFieldId))
  if (query.manualTitle?.trim())
    params.set("manualTitle", query.manualTitle.trim())
  if (query.manualStatus) params.set("manualStatus", query.manualStatus)
  return authenticatedRequest<ManualListResponse>(`/api/v1/manuals?${params}`, {
    signal,
  })
}

export type ManualRegisterRequest = {
  manualTitle: string
  trainingFieldId: number
  manualDescription?: string
}

export type ManualRegisterResponse = {
  manualId: number
  manualTitle: string
  trainingFieldId: number
  manualDescription: string | null
  manualStatus: "TEMPORARY_SAVED"
  file: {
    manualFileId: number
    originalName: string
    fileType: "PDF" | "PPT" | "HWP" | "WORD"
    storageKey: string
    storedFileName: string
    sizeBytes: number
  }
}

export const MAX_MANUAL_FILE_SIZE = 50 * 1024 * 1024
export const MANUAL_FILE_ACCEPT = ".pdf,.ppt,.pptx,.doc,.docx,.hwp"

export function validateManualFile(file: File): string | null {
  if (!/\.(pdf|ppt|pptx|doc|docx|hwp)$/i.test(file.name))
    return "PDF, PPT, PPTX, DOC, DOCX, HWP 5 파일을 선택해 주세요."
  if (file.size === 0) return "빈 파일은 등록할 수 없습니다."
  if (file.size > MAX_MANUAL_FILE_SIZE)
    return "파일은 최대 50MB까지 등록할 수 있습니다."
  return null
}

export async function registerManual(
  request: ManualRegisterRequest,
  file: File,
): Promise<ManualRegisterResponse> {
  const body = new FormData()
  body.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" }),
  )
  body.append("file", file)
  return authenticatedRequest<ManualRegisterResponse>("/api/v1/manuals", {
    method: "POST",
    body,
    // 큰 원본 파일 업로드는 일반 JSON 요청보다 오래 걸릴 수 있습니다.
    signal: AbortSignal.timeout(120000),
  })
}
