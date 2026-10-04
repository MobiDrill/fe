import Icon from "@/components/ui/Icon"

// 교범 목록의 현재 페이지 표시와 이전·다음 이동을 담당합니다.
type ManualPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function ManualPagination({
  currentPage,
  totalPages,
  onPageChange: setCurrentPage,
}: ManualPaginationProps) {
  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
  const pages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => startPage + index,
  )
  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
      <div className="text-xs font-semibold text-slate-400">페이지당 10개</div>
      <div className="flex items-center gap-1">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          onKeyDown={(event) =>
            event.key === "Enter" &&
            setCurrentPage(Math.max(1, currentPage - 1))
          }
          className={`flex size-8 items-center justify-center rounded-md border border-slate-200 ${
            currentPage === 1
              ? "cursor-not-allowed text-slate-300"
              : "cursor-pointer text-slate-500 hover:bg-slate-100"
          }`}
        >
          <Icon name="chevron" className="size-4 rotate-180" />
        </div>
        {pages.map((page) => (
          <div
            key={page}
            role="button"
            tabIndex={0}
            onClick={() => setCurrentPage(page)}
            onKeyDown={(event) => event.key === "Enter" && setCurrentPage(page)}
            className={`flex size-8 cursor-pointer items-center justify-center rounded-md text-xs font-bold ${
              currentPage === page
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {page}
          </div>
        ))}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          onKeyDown={(event) =>
            event.key === "Enter" &&
            setCurrentPage(Math.min(totalPages, currentPage + 1))
          }
          className={`flex size-8 items-center justify-center rounded-md border border-slate-200 ${
            currentPage === totalPages
              ? "cursor-not-allowed text-slate-300"
              : "cursor-pointer text-slate-500 hover:bg-slate-100"
          }`}
        >
          <Icon name="chevron" className="size-4" />
        </div>
      </div>
    </div>
  )
}
