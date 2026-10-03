import { authenticatedRequest } from "@/features/auth/api/authenticatedRequest"

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
