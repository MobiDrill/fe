import { useCallback, useEffect, useMemo, useState } from "react"
import { getManuals, manualStatuses } from "../api/manuals.api"
import type {
  ManualApiStatus,
  ManualListItem,
  ManualListResponse,
} from "../api/manuals.api"
import type {
  ManualDocument,
  ManualScope,
  ManualSortOrder,
} from "../model/manual.types"
import { errorMessage } from "@/lib/api/http"

export function toManualDocument(item: ManualListItem): ManualDocument {
  const state = manualStatuses[item.manualStatus]
  return {
    manualId: item.manualId,
    registeredByName: item.registeredByName,
    name: item.manualTitle,
    version: "—",
    type: item.fileType ?? "—",
    trainingFieldId: item.trainingField?.id ?? null,
    field: item.trainingField?.name ?? "미지정",
    state,
    tone:
      item.manualStatus === "ABNORMAL_TERMINATION"
        ? "red"
        : state === "검수 완료"
          ? "green"
          : state.startsWith("문제 검수")
            ? "purple"
            : state.startsWith("검수")
              ? "amber"
              : state === "임시 저장"
                ? "neutral"
                : "blue",
    date: item.updatedAt
      ? new Date(item.updatedAt).toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
        })
      : "—",
  }
}

export default function useManualList(
  enabled: boolean,
  owner?: number,
  entryRevision = 0,
) {
  const [scope, setScopeValue] = useState<ManualScope>("전체")
  const [selectedField, setFieldValue] = useState("전체 분야")
  const [sortOrder, setSortValue] = useState<ManualSortOrder>("최신 등록순")
  const [searchQuery, setSearchValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [revision, setRevision] = useState(0)
  const [response, setResponse] = useState<ManualListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const reload = useCallback(() => setRevision((value) => value + 1), [])
  const setScope = (value: ManualScope) => {
    setScopeValue(value)
    setCurrentPage(1)
  }
  const setSelectedField = (value: string) => {
    setFieldValue(value)
    setCurrentPage(1)
  }
  const setSortOrder = (value: ManualSortOrder) => {
    setSortValue(value)
    setCurrentPage(1)
  }
  const setSearchQuery = (value: string) => {
    setSearchValue(value)
    setCurrentPage(1)
  }

  useEffect(() => {
    const controller = new AbortController()
    setResponse(null)
    setLoadError("")
    setLoading(enabled)
    if (!enabled) return () => controller.abort()
    // 검색 입력을 짧게 모으고 이전 요청의 응답이 새 조건을 덮어쓰지 않게 합니다.
    const timer = window.setTimeout(() => {
      const manualStatus = (Object.keys(
        manualStatuses,
      ) as ManualApiStatus[]).find((status) => manualStatuses[status] === scope)
      void getManuals(
        {
          sort: sortOrder === "최신 등록순" ? "LATEST" : "OLDEST",
          page: currentPage,
          size: 10,
          trainingFieldId:
            selectedField === "전체 분야" ? undefined : Number(selectedField),
          manualTitle: searchQuery,
          manualStatus,
        },
        controller.signal,
      )
        .then((result) => {
          if (controller.signal.aborted) return
          const lastPage = Math.max(1, result.manuals.totalPages)
          if (currentPage > lastPage) {
            setCurrentPage(lastPage)
            return
          }
          setResponse(result)
        })
        .catch((error) => {
          if (!controller.signal.aborted) setLoadError(errorMessage(error))
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false)
        })
    }, 250)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [
    enabled,
    owner,
    entryRevision,
    scope,
    selectedField,
    sortOrder,
    searchQuery,
    currentPage,
    revision,
  ])

  const documents = useMemo(
    () => response?.manuals.content.map(toManualDocument) ?? [],
    [response],
  )
  const total = response?.manuals.totalElements ?? 0
  return {
    documents,
    metadata: response?.metadata,
    loading,
    loadError,
    reload,
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
    total,
    totalPages: Math.max(1, response?.manuals.totalPages ?? 0),
    rangeStart: documents.length ? (currentPage - 1) * 10 + 1 : 0,
    rangeEnd: documents.length ? (currentPage - 1) * 10 + documents.length : 0,
  }
}
