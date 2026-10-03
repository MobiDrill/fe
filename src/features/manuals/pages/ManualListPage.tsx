import { useState } from "react"
import Button from "@/components/ui/Button"
import CompletedAnalysisModal from "@/features/manuals/components/CompletedAnalysisModal"
import DraftManualModal from "@/features/manuals/components/DraftManualModal"
import ExtractionProgressModal from "@/features/manuals/components/ExtractionProgressModal"
import ManualFilters from "@/features/manuals/components/ManualFilters"
import ManualPagination from "@/features/manuals/components/ManualPagination"
import ManualTable from "@/features/manuals/components/ManualTable"
import ProblemGenerationModal from "@/features/manuals/components/ProblemGenerationModal"
import ReviewSummaryModal from "@/features/manuals/components/ReviewSummaryModal"
import useManualFilters from "@/features/manuals/hooks/useManualFilters"
import type {
  ManualDocument,
  ReviewProgress,
} from "@/features/manuals/model/manual.types"

// 교범 목록의 필터, 페이지네이션, 상태별 모달 진입을 조합하는 메인 페이지입니다.
type ManualListPageProps = {
  documents: ManualDocument[]
  trainingFields: string[]
  reviewProgress: Record<string, ReviewProgress>
  problemReviewProgress: Record<string, ReviewProgress>
  onRegister: () => void
  onOpenReview: (document: ManualDocument) => void
  onOpenProblemPreview: (document: ManualDocument) => void
  onOpenProblemReview: (document: ManualDocument) => void
  onNotify: (message: string) => void
}

export default function ManualListPage(props: ManualListPageProps) {
  const filters = useManualFilters(props.documents)
  const [selectedExtractionDocument, setSelectedExtractionDocument] =
    useState<ManualDocument | null>(null)
  const [selectedDraftDocument, setSelectedDraftDocument] =
    useState<ManualDocument | null>(null)
  const [selectedReviewDocument, setSelectedReviewDocument] =
    useState<ManualDocument | null>(null)
  const [selectedCompletedDocument, setSelectedCompletedDocument] =
    useState<ManualDocument | null>(null)
  const [selectedGeneratingDocument, setSelectedGeneratingDocument] =
    useState<ManualDocument | null>(null)
  const openDocument = (document: ManualDocument) => {
    if (document.state === "추출 중") setSelectedExtractionDocument(document)
    if (document.state === "임시 저장") setSelectedDraftDocument(document)
    if (document.state === "검수 필요") setSelectedReviewDocument(document)
    if (document.state === "검수 완료") setSelectedCompletedDocument(document)
    if (document.state === "문제 생성 중")
      setSelectedGeneratingDocument(document)
    if (document.state === "문제 검수 필요")
      props.onOpenProblemPreview(document)
  }
  return (
    <>
      <div className="mx-auto max-w-screen-2xl p-5 md:p-8">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="text-3xl font-black tracking-tight">교범 관리</div>
          <Button icon="upload" onClick={props.onRegister}>
            교범 등록
          </Button>
        </div>
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
          <ManualFilters
            documents={props.documents}
            trainingFields={["전체 분야", ...props.trainingFields]}
            searchQuery={filters.searchQuery}
            onSearchChange={filters.setSearchQuery}
            selectedField={filters.selectedField}
            onFieldChange={filters.setSelectedField}
            scope={filters.scope}
            onScopeChange={filters.setScope}
            sortOrder={filters.sortOrder}
            onSortChange={filters.setSortOrder}
            total={filters.sortedDocuments.length}
            rangeStart={filters.rangeStart}
            rangeEnd={filters.rangeEnd}
          />
          <ManualTable
            documents={filters.paginatedDocuments}
            reviewProgress={props.reviewProgress}
            problemReviewProgress={props.problemReviewProgress}
            onOpenDocument={openDocument}
            onOpenReview={props.onOpenReview}
            onOpenProblemPreview={props.onOpenProblemPreview}
            onOpenProblemReview={props.onOpenProblemReview}
            onNotify={props.onNotify}
          />
          <ManualPagination
            currentPage={filters.currentPage}
            totalPages={filters.totalPages}
            onPageChange={filters.setCurrentPage}
          />
        </section>
      </div>
      <ReviewSummaryModal
        document={selectedReviewDocument}
        onClose={() => setSelectedReviewDocument(null)}
        onOpenReview={props.onOpenReview}
      />
      <DraftManualModal
        document={selectedDraftDocument}
        onClose={() => setSelectedDraftDocument(null)}
        onNotify={props.onNotify}
      />
      <ExtractionProgressModal
        document={selectedExtractionDocument}
        onClose={() => setSelectedExtractionDocument(null)}
        onNotify={props.onNotify}
      />
      <CompletedAnalysisModal
        document={selectedCompletedDocument}
        onClose={() => setSelectedCompletedDocument(null)}
        onNotify={props.onNotify}
      />
      <ProblemGenerationModal
        document={selectedGeneratingDocument}
        onClose={() => setSelectedGeneratingDocument(null)}
        onNotify={props.onNotify}
      />
    </>
  )
}
