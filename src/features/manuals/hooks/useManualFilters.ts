import { useEffect, useMemo, useState } from "react"
import type {
  ManualDocument,
  ManualScope,
  ManualSortOrder,
} from "@/features/manuals/model/manual.types"

// 교범 검색·분야·상태·정렬 조건과 페이지네이션 계산을 한곳에서 관리합니다.
const PAGE_SIZE = 10

export default function useManualFilters(documents: ManualDocument[]) {
  const [scope, setScope] = useState<ManualScope>("전체")
  const [selectedField, setSelectedField] = useState("전체 분야")
  const [sortOrder, setSortOrder] = useState<ManualSortOrder>("최신 등록순")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const sortedDocuments = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase()
    const filteredDocuments = documents.filter(
      (document) =>
        document.name.toLocaleLowerCase().includes(normalizedQuery) &&
        (selectedField === "전체 분야" || document.field === selectedField) &&
        (scope === "전체" || document.state === scope),
    )
    return sortOrder === "최신 등록순"
      ? filteredDocuments
      : [...filteredDocuments].reverse()
  }, [documents, scope, searchQuery, selectedField, sortOrder])

  useEffect(
    () => setCurrentPage(1),
    [scope, searchQuery, selectedField, sortOrder],
  )

  const totalPages = Math.max(1, Math.ceil(sortedDocuments.length / PAGE_SIZE))
  return {
    scope,
    setScope,
    selectedField,
    setSelectedField,
    sortOrder,
    setSortOrder,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    sortedDocuments,
    paginatedDocuments: sortedDocuments.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE,
    ),
    totalPages,
    rangeStart:
      sortedDocuments.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1,
    rangeEnd: Math.min(currentPage * PAGE_SIZE, sortedDocuments.length),
  }
}
