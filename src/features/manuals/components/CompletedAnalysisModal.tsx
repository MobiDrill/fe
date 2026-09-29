import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import { reviewSections } from "@/features/manuals/data/reviewSections.mock"
import type { ManualDocument } from "@/features/manuals/model/manual.types"

// 검수가 완료된 교범의 분석 결과를 보여주고 문제 생성을 시작하는 모달입니다.
type CompletedAnalysisModalProps = {
  document: ManualDocument | null
  onClose: () => void
  onNotify: (message: string) => void
}

export default function CompletedAnalysisModal(
  props: CompletedAnalysisModalProps,
) {
  const { document } = props
  if (!document) return null
  return (
    <div
      role="presentation"
      onClick={() => props.onClose()}
      className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-sm md:p-10"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="검수 완료 교범 분석 결과"
        onClick={(event) => event.stopPropagation()}
        className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="min-w-0 flex-1 pr-6">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="green">검수 완료</Badge>
              <span className="text-xs font-semibold text-slate-400">
                {document.field}
              </span>
            </div>
            <div className="text-xl font-black">{document.name}</div>
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => props.onClose()}
            onKeyDown={(event) => event.key === "Enter" && props.onClose()}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <Icon name="plus" className="size-5 rotate-45" />
          </div>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          {reviewSections.map((sec, secIndex) => (
            <div
              key={sec.title}
              className="border-b border-slate-100 px-6 py-5 last:border-b-0"
            >
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-black text-white">
                  {secIndex + 1}
                </span>
                <div className="text-base font-extrabold">{sec.title}</div>
              </div>
              <div className="space-y-3">
                {sec.rows.map((row) => (
                  <div
                    key={row.label}
                    className="overflow-hidden rounded-xl border border-slate-100"
                  >
                    <div className="border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                      <span className="text-xs font-bold text-slate-500">
                        {row.label}
                      </span>
                    </div>
                    {row.subItems ? (
                      <div className="divide-y divide-slate-100">
                        {row.subItems.map((sub, subIndex) => (
                          <div
                            key={sub.label}
                            className="grid gap-2 px-4 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4"
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="flex size-4 items-center justify-center rounded bg-slate-200 text-[9px] font-black text-slate-500">
                                {subIndex + 1}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">
                                {sub.label}
                              </span>
                            </div>
                            <span className="text-sm font-medium leading-relaxed text-slate-700">
                              {sub.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-3">
                        <span className="text-sm font-medium leading-relaxed text-slate-700">
                          {row.value}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Icon name="check" className="size-4 text-emerald-500" />
            검수 완료 · {document.date}
          </div>
          <Button
            onClick={() => {
              props.onNotify(`${document.name} 문제 생성을 시작합니다.`)
              props.onClose()
            }}
          >
            문제 생성
          </Button>
        </div>
      </div>
    </div>
  )
}
