import { useCallback, useRef, useState } from "react"
import Icon from "@/components/ui/Icon"
import useOutsideClick from "@/features/manuals/hooks/useOutsideClick"
import type {
  ManualScope,
  ManualSortOrder,
} from "@/features/manuals/model/manual.types"
import { manualStatuses } from "../api/manuals.api"
import type { ManualListMetadata } from "../api/manuals.api"
import type { TrainingField } from "@/features/training-fields/model/trainingFields"

// 교범 통계, 검색, 분야, 정렬, 상태 범위 필터를 관리합니다.
type ManualFiltersProps = {
  metadata?: ManualListMetadata
  trainingFields: TrainingField[]
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedField: string
  onFieldChange: (value: string) => void
  scope: ManualScope
  onScopeChange: (value: ManualScope) => void
  sortOrder: ManualSortOrder
  onSortChange: (value: ManualSortOrder) => void
  total: number
  rangeStart: number
  rangeEnd: number
}

export default function ManualFilters({
  metadata,
  trainingFields,
  searchQuery,
  onSearchChange: setSearchQuery,
  selectedField,
  onFieldChange: setSelectedField,
  scope,
  onScopeChange: setScope,
  sortOrder,
  onSortChange: setSortOrder,
  total: sortedDocumentsLength,
  rangeStart,
  rangeEnd,
}: ManualFiltersProps) {
  const [isFieldMenuOpen, setIsFieldMenuOpen] = useState(false)
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
  const fieldMenuRef = useRef<HTMLDivElement>(null)
  const sortMenuRef = useRef<HTMLDivElement>(null)
  const closeFieldMenu = useCallback(() => setIsFieldMenuOpen(false), [])
  const closeSortMenu = useCallback(() => setIsSortMenuOpen(false), [])
  useOutsideClick(fieldMenuRef, closeFieldMenu)
  useOutsideClick(sortMenuRef, closeSortMenu)
  const sortedDocuments = { length: sortedDocumentsLength }
  return (
    <>
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
          <div>
            <span className="text-sm font-semibold text-slate-500">
              전체 교범
            </span>
            <span className="ml-2 text-lg font-black">
              {metadata?.totalManualCount ?? 0}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <span className="text-sm font-semibold text-slate-500">
              분석 중
            </span>
            <span className="ml-2 text-lg font-black text-blue-700">
              {metadata?.extractionOngoingCount ?? 0}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <span className="text-sm font-semibold text-slate-500">
              검수 필요
            </span>
            <span className="ml-2 text-lg font-black text-amber-700">
              {metadata?.reviewNeedCount ?? 0}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <span className="text-sm font-semibold text-slate-500">
              문제 생성 중
            </span>
            <span className="ml-2 text-lg font-black text-blue-700">
              {metadata?.questionGenerationOngoingCount ?? 0}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <span className="text-sm font-semibold text-slate-500">
              문제 검수 필요
            </span>
            <span className="ml-2 text-lg font-black text-violet-700">
              {metadata?.questionReviewNeedCount ?? 0}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex min-w-60 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus-within:border-slate-400">
            <Icon name="search" className="size-4 shrink-0 text-slate-400" />
            {!searchQuery && (
              <span className="pointer-events-none absolute left-10 text-slate-400">
                교범명 검색
              </span>
            )}
            <input
              type="search"
              aria-label="교범명 검색"
              value={searchQuery}
              maxLength={100}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="min-w-0 flex-1 text-slate-700 outline-none"
            />
          </div>
          <div ref={fieldMenuRef} className="relative w-72">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsFieldMenuOpen((open) => !open)}
              onKeyDown={(event) =>
                event.key === "Enter" && setIsFieldMenuOpen((open) => !open)
              }
              className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2.5 text-sm font-semibold transition-colors ${
                isFieldMenuOpen
                  ? "border-slate-400 text-slate-900"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              <span className="max-w-48 truncate">
                {selectedField === "전체 분야"
                  ? selectedField
                  : (trainingFields.find(
                      (field) =>
                        String(field.trainingFieldId) === selectedField,
                    )?.name ?? "선택한 분야")}
              </span>
              <Icon
                name="chevron"
                className={`size-4 transition-transform ${
                  isFieldMenuOpen ? "-rotate-90" : "rotate-90"
                }`}
              />
            </div>
            {isFieldMenuOpen && (
              <div className="absolute right-0 top-full z-30 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/70">
                <div className="px-3 pb-2 pt-1 text-xs font-bold tracking-wide text-slate-400">
                  훈련 분야 선택
                </div>
                {[
                  { trainingFieldId: "전체 분야", name: "전체 분야" },
                  ...trainingFields,
                ].map((field) => (
                  <div
                    key={field.trainingFieldId}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedField(String(field.trainingFieldId))
                      setIsFieldMenuOpen(false)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        setSelectedField(String(field.trainingFieldId))
                        setIsFieldMenuOpen(false)
                      }
                    }}
                    className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      selectedField === String(field.trainingFieldId)
                        ? "bg-slate-900 font-bold text-white"
                        : "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span>{field.name}</span>
                    {selectedField === String(field.trainingFieldId) && (
                      <Icon name="check" className="size-4 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div ref={sortMenuRef} className="relative w-36">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsSortMenuOpen((open) => !open)}
              onKeyDown={(event) =>
                event.key === "Enter" && setIsSortMenuOpen((open) => !open)
              }
              className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2.5 text-sm font-semibold transition-colors ${
                isSortMenuOpen
                  ? "border-slate-400 text-slate-900"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              {sortOrder}
              <Icon
                name="chevron"
                className={`size-4 transition-transform ${
                  isSortMenuOpen ? "-rotate-90" : "rotate-90"
                }`}
              />
            </div>
            {isSortMenuOpen && (
              <div className="absolute right-0 top-full z-30 mt-2 w-full rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/70">
                {(["최신 등록순", "예전 등록순"] as const).map((order) => (
                  <div
                    key={order}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSortOrder(order)
                      setIsSortMenuOpen(false)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        setSortOrder(order)
                        setIsSortMenuOpen(false)
                      }
                    }}
                    className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm ${
                      sortOrder === order
                        ? "bg-slate-900 font-bold text-white"
                        : "font-semibold text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {order}
                    {sortOrder === order && (
                      <Icon name="check" className="size-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 overflow-x-auto border-b border-slate-100 px-5 pt-4">
        <div className="flex shrink-0 gap-6">
          {(["전체", ...Object.values(manualStatuses)] as ManualScope[]).map(
            (item) => (
              <div
                key={item}
                role="button"
                tabIndex={0}
                onClick={() => setScope(item)}
                onKeyDown={(event) => event.key === "Enter" && setScope(item)}
                className={`cursor-pointer border-b-2 px-1 pb-4 text-sm font-bold ${
                  scope === item
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-400"
                }`}
              >
                {item}
              </div>
            ),
          )}
        </div>
        <div className="hidden pb-4 text-xs font-semibold text-slate-400 sm:block">
          총 {sortedDocuments.length}개 중 {rangeStart}–{rangeEnd}
        </div>
      </div>
    </>
  )
}
