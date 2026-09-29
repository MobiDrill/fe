import type { BadgeTone } from "@/components/ui/Badge"

// 교범 관리 기능에서 공유하는 데이터 구조와 화면 상태 타입을 정의합니다.
export type ManualStatus = "임시 저장" | "추출 중" | "검수 필요" | "검수 완료" | "문제 생성 중" | "문제 검수 필요" | "문제 검수 완료"
export type ManualScope = "전체" | ManualStatus
export type ManualSortOrder = "최신 등록순" | "예전 등록순"
export type ReviewProgress = { completed: number current: number }
export type ManualDocument = {
  name: string
  version: string
  type: string
  field: string
  state: ManualStatus
  tone: BadgeTone
  date: string
}

export type SubItem = { label: string value: string }
export type SectionRow = { label: string value?: string subItems?: SubItem[] }
export type ReviewSection = {
  title: string
  shortTitle: string
  source: string
  sourceHeading: string
  sourceText: string[]
  rows: SectionRow[]
}
export type ProblemRole = { role: string action: string }
export type ProblemScenario = { label: string description: string }
export type GeneratedQuestion = {
  situation: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}
export type ProblemSection = {
  no: number
  title: string
  type: string
  situationVideo: string
  situationEval: string
  objective: string
  roles: ProblemRole[]
  scenarios: ProblemScenario[]
  evalCriteria: string[]
  generatedQuestion: GeneratedQuestion
}
