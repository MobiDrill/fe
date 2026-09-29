import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import type { ManualDocument } from "@/features/manuals/model/manual.types"

// 교범 지식 추출의 전체 진행률과 단계별 상태를 표시하는 모달입니다.
type ExtractionProgressModalProps = {
  document: ManualDocument | null
  onClose: () => void
  onNotify: (message: string) => void
}

export default function ExtractionProgressModal(
  props: ExtractionProgressModalProps,
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
        aria-label="추출 작업 상세 정보"
        onClick={(event) => event.stopPropagation()}
        className="my-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="blue">추출 중</Badge>
            </div>
            <div className="text-xl font-black">{document.name}</div>
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => props.onClose()}
            onKeyDown={(event) => event.key === "Enter" && props.onClose()}
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <Icon name="plus" className="size-5 rotate-45" />
          </div>
        </div>
        <div className="space-y-6 p-6">
          <section>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-black text-blue-700">68%</div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                  <span className="size-3 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></span>
                  발생 가능 상황 분석 및 추출 중
                </div>
              </div>
              <div className="shrink-0 text-xs font-semibold text-slate-400">
                2 / 4단계 완료
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-2/3 rounded-full bg-blue-600"></div>
            </div>
          </section>
          <section>
            <div className="mb-3 text-sm font-extrabold text-slate-900">
              교범 정보
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-400">
                  훈련 분야
                </div>
                <div className="mt-2 text-sm font-bold text-slate-700">
                  {document.field}
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-400">
                  원본 파일
                </div>
                <div className="mt-2 text-sm font-bold text-slate-700">
                  {document.type}
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-400">
                  등록자
                </div>
                <div className="mt-2 text-sm font-bold text-slate-700">
                  김관리
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-extrabold text-slate-900">
                추출 현황
              </div>
              <span className="text-xs font-semibold text-slate-400">
                실시간 업데이트
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              {[
                {
                  label: "문서 구조 및 교육과목 분석",
                  value: "완료",
                  tone: "green" as const,
                },
                {
                  label: "교육 목표 및 핵심 개념 추출",
                  value: "완료",
                  tone: "green" as const,
                },
                {
                  label: "발생 가능 상황 분석 및 추출",
                  value: "분석 중",
                  tone: "blue" as const,
                },
                {
                  label: "상황별 상세 지침 정의",
                  value: "대기",
                  tone: "neutral" as const,
                },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 last:border-b-0"
                >
                  <div
                    className={`flex size-7 items-center justify-center rounded-full text-xs font-black ${
                      item.tone === "green"
                        ? "bg-emerald-50 text-emerald-700"
                        : item.tone === "blue"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {item.tone === "green" ? (
                      <Icon name="check" className="size-3.5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="flex-1 text-sm font-semibold text-slate-700">
                    {item.label}
                  </span>
                  <Badge tone={item.tone}>{item.value}</Badge>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="flex items-center justify-end rounded-b-2xl border-t border-slate-100 bg-slate-50 px-6 py-4">
          <Button
            variant="secondary"
            onClick={() => {
              props.onNotify(`${document.name} 지식 추출을 중단했습니다.`)
              props.onClose()
            }}
          >
            중단하기
          </Button>
        </div>
      </div>
    </div>
  )
}
