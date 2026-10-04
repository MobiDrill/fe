import { useEffect, useState } from "react"
import Badge from "@/components/ui/Badge"
import Icon from "@/components/ui/Icon"
import { problemSections } from "@/features/manuals/data/problemSections.mock"
import type {
  ManualDocument,
  ReviewProgress,
} from "@/features/manuals/model/manual.types"

// 필터링된 교범 행과 문서별 작업 메뉴를 렌더링합니다.
type ManualTableProps = {
  documents: ManualDocument[]
  reviewProgress: Record<string, ReviewProgress>
  problemReviewProgress: Record<string, ReviewProgress>
  onOpenDocument: (document: ManualDocument) => void
  onOpenReview: (document: ManualDocument) => void
  onOpenProblemPreview: (document: ManualDocument) => void
  onOpenProblemReview: (document: ManualDocument) => void
  onNotify: (message: string) => void
}

export default function ManualTable({
  documents: paginatedDocuments,
  reviewProgress,
  problemReviewProgress,
  onOpenDocument,
  onOpenReview: openDetailedReview,
  onOpenProblemPreview,
  onOpenProblemReview,
  onNotify: showNotice,
}: ManualTableProps) {
  const [openDocumentMenu, setOpenDocumentMenu] = useState<string | null>(null)
  const [extractingDraftName, setExtractingDraftName] = useState<string | null>(
    null,
  )
  useEffect(() => {
    const closeMenu = (event: PointerEvent) => {
      if (!(event.target as Element).closest("[data-document-menu]"))
        setOpenDocumentMenu(null)
    }
    document.addEventListener("pointerdown", closeMenu)
    return () => document.removeEventListener("pointerdown", closeMenu)
  }, [])
  const startDraftExtraction = async (documentName: string) => {
    if (extractingDraftName) return
    setExtractingDraftName(documentName)
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1500))
      showNotice(`${documentName} 지식 추출을 시작했습니다.`)
    } finally {
      setExtractingDraftName(null)
    }
  }
  return (
    <>
      <div className="hidden grid-cols-[minmax(0,2fr)_0.9fr_0.8fr_0.8fr_0.8fr_2rem] gap-4 border-b border-slate-100 bg-slate-50 px-6 py-3 text-xs font-bold text-slate-400 md:grid">
        <span>교범명</span>
        <span>훈련 분야</span>
        <span>분석 상태</span>
        <span>최근 수정</span>
        <span>작업</span>
        <span></span>
      </div>
      <div className="divide-y divide-slate-100">
        {paginatedDocuments.map((doc) => (
          <div
            key={doc.manualId ?? doc.name}
            role={
              [
                "임시 저장",
                "추출 중",
                "검수 필요",
                "검수 완료",
                "문제 생성 중",
                "문제 검수 필요",
              ].includes(doc.state)
                ? "button"
                : undefined
            }
            tabIndex={
              [
                "임시 저장",
                "추출 중",
                "검수 필요",
                "검수 완료",
                "문제 생성 중",
                "문제 검수 필요",
              ].includes(doc.state)
                ? 0
                : undefined
            }
            onClick={() => {
              if (doc.state === "추출 중") onOpenDocument(doc)
              if (doc.state === "임시 저장") onOpenDocument(doc)
              if (doc.state === "검수 필요") onOpenDocument(doc)
              if (doc.state === "검수 완료") onOpenDocument(doc)
              if (doc.state === "문제 생성 중") onOpenDocument(doc)
              if (doc.state === "문제 검수 필요") onOpenProblemPreview(doc)
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return
              if (doc.state === "추출 중") onOpenDocument(doc)
              if (doc.state === "임시 저장") onOpenDocument(doc)
              if (doc.state === "검수 필요") onOpenDocument(doc)
              if (doc.state === "검수 완료") onOpenDocument(doc)
              if (doc.state === "문제 생성 중") onOpenDocument(doc)
              if (doc.state === "문제 검수 필요") onOpenProblemPreview(doc)
            }}
            className={`group relative grid gap-3 px-6 py-5 transition-colors hover:bg-slate-50 md:grid-cols-[minmax(0,2fr)_0.9fr_0.8fr_0.8fr_0.8fr_2rem] md:items-center md:gap-4 ${
              [
                "임시 저장",
                "추출 중",
                "검수 필요",
                "검수 완료",
                "문제 생성 중",
                "문제 검수 필요",
              ].includes(doc.state)
                ? "cursor-pointer"
                : ""
            } ${
              openDocumentMenu === String(doc.manualId ?? doc.name)
                ? "z-20 bg-slate-50"
                : "z-0"
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Icon name="file" className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">{doc.name}</div>
                <div className="mt-1 text-xs text-slate-400">
                  {doc.type} · {doc.registeredByName ?? "미지정"} 등록
                </div>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-600">
              {doc.field}
            </div>
            <div>
              <Badge tone={doc.tone} plain>
                {doc.state}
              </Badge>
            </div>
            <div className="text-xs text-slate-500">{doc.date}</div>
            <div>
              {doc.state === "임시 저장" && (
                <div
                  role="button"
                  tabIndex={extractingDraftName === doc.name ? -1 : 0}
                  onClick={(event) => {
                    event.stopPropagation()
                    void startDraftExtraction(doc.name)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.stopPropagation()
                      void startDraftExtraction(doc.name)
                    }
                  }}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900 transition-colors ${
                    extractingDraftName === doc.name
                      ? "cursor-wait opacity-70"
                      : "cursor-pointer hover:bg-slate-200"
                  }`}
                >
                  {extractingDraftName === doc.name && (
                    <span className="size-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"></span>
                  )}
                  {extractingDraftName === doc.name ? "요청 중" : "추출하기"}
                </div>
              )}
              {doc.state === "추출 중" && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation()
                    showNotice(`${doc.name} 지식 추출을 중단했습니다.`)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.stopPropagation()
                      showNotice(`${doc.name} 지식 추출을 중단했습니다.`)
                    }
                  }}
                  className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-200"
                >
                  중단하기
                </div>
              )}
              {doc.state === "검수 필요" && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation()
                    openDetailedReview(doc)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.stopPropagation()
                      openDetailedReview(doc)
                    }
                  }}
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-200"
                >
                  검수하기
                  {(reviewProgress[doc.name]?.completed ?? 0) > 0 && (
                    <span className="rounded bg-slate-300/70 px-1.5 py-0.5 text-[10px] font-black tabular-nums">
                      {reviewProgress[doc.name].completed}/4
                    </span>
                  )}
                </div>
              )}
              {doc.state === "검수 완료" && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation()
                    showNotice(`${doc.name} 문제 생성을 시작합니다.`)
                  }}
                  onKeyDown={(event) =>
                    event.key === "Enter" &&
                    showNotice(`${doc.name} 문제 생성을 시작합니다.`)
                  }
                  className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-200"
                >
                  문제 생성
                </div>
              )}
              {doc.state === "문제 생성 중" && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation()
                    showNotice(`${doc.name} 문제 생성을 중단했습니다.`)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.stopPropagation()
                      showNotice(`${doc.name} 문제 생성을 중단했습니다.`)
                    }
                  }}
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-200"
                >
                  <span className="size-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"></span>
                  중단하기
                </div>
              )}
              {doc.state === "문제 검수 필요" && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation()
                    onOpenProblemReview(doc)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.stopPropagation()
                      onOpenProblemReview(doc)
                    }
                  }}
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-200"
                >
                  문제 검수
                  {(problemReviewProgress[doc.name]?.completed ?? 0) > 0 && (
                    <span className="rounded bg-slate-300/70 px-1.5 py-0.5 text-[10px] font-black tabular-nums">
                      {problemReviewProgress[doc.name].completed}/
                      {problemSections.length}
                    </span>
                  )}
                </div>
              )}
              {doc.state === "문제 검수 완료" && (
                <div className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900">
                  완료
                </div>
              )}
            </div>
            <div
              data-document-menu
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
              className="relative"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation()
                  setOpenDocumentMenu((current) =>
                    current === String(doc.manualId ?? doc.name)
                      ? null
                      : String(doc.manualId ?? doc.name),
                  )
                }}
                onKeyDown={(event) =>
                  event.key === "Enter" &&
                  setOpenDocumentMenu((current) =>
                    current === String(doc.manualId ?? doc.name)
                      ? null
                      : String(doc.manualId ?? doc.name),
                  )
                }
                className={`flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors ${
                  openDocumentMenu === String(doc.manualId ?? doc.name)
                    ? "bg-slate-200 text-slate-900"
                    : "text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                }`}
              >
                <Icon name="more" className="size-5" />
              </div>
              {openDocumentMenu === String(doc.manualId ?? doc.name) && (
                <div className="absolute right-0 top-full z-30 mt-2 w-32 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/70">
                  {doc.state !== "검수 필요" && (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        showNotice(`${doc.name} 수정 화면을 엽니다.`)
                        setOpenDocumentMenu(null)
                      }}
                      className="cursor-pointer rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      수정
                    </div>
                  )}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      showNotice(`${doc.name} 삭제를 요청했습니다.`)
                      setOpenDocumentMenu(null)
                    }}
                    className="cursor-pointer rounded-md px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    삭제
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {paginatedDocuments.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Icon name="search" />
            </div>
            <div className="mt-4 text-sm font-bold text-slate-700">
              검색 결과가 없습니다
            </div>
            <p className="mt-1 text-xs text-slate-400">
              다른 교범명이나 분야로 다시 검색해 주세요.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
