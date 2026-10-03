import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import { problemSections } from "@/features/manuals/data/problemSections.mock"
import type { ManualDocument } from "@/features/manuals/model/manual.types"

// 생성된 문제 전체를 검수 전에 요약해서 확인하는 미리보기 화면입니다.
export default function ProblemPreviewPage({
  document,
  onBack,
  onStartReview,
}: {
  document: ManualDocument
  onBack: () => void
  onStartReview: () => void
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-200 bg-white px-5 py-5 md:px-8">
        <div
          role="button"
          tabIndex={0}
          onClick={onBack}
          onKeyDown={(e) => e.key === "Enter" && onBack()}
          className="mb-4 inline-flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
        >
          <Icon name="chevron" className="size-4 rotate-180" />
          교범 관리로 돌아가기
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="purple">문제 검수 필요</Badge>
              <span className="text-xs font-semibold text-slate-400">
                {document.field}
              </span>
            </div>
            <div className="text-2xl font-black">{document.name}</div>
          </div>
          <div className="flex items-center gap-3">
            <Button icon="check" onClick={onStartReview}>
              문제 검수하기
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-8rem)] flex-col">
        <section className="min-w-0 flex-1 bg-white p-5 md:p-8">
          <div className="mx-auto max-w-3xl space-y-6">
            <div>
              <div className="mb-4 text-lg font-extrabold">기본 정보</div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "훈련 분야", value: document.field },
                  { label: "최근 수정", value: document.date },
                  { label: "등록자", value: "김관리" },
                  { label: "파일 형식", value: document.type },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-400">
                      {item.label}
                    </div>
                    <div className="mt-2 text-sm font-bold text-slate-700">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 text-lg font-extrabold">교범 설명</div>
              <div className="min-h-20 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
                오염지역에서 분대원이 수행해야 하는 역할과 행동 절차, 정보 공유
                방법 및 금지 행동을 정리한 교육 지침입니다.
              </div>
            </div>

            <div>
              <div className="mb-3 text-lg font-extrabold">
                생성된 문제 목록
              </div>
              <div className="space-y-2">
                {problemSections.map((ps) => (
                  <div
                    key={ps.no}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500">
                      {ps.no}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-slate-800">
                        {ps.title}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                        <span>{ps.type} 단위</span>
                        <span>·</span>
                        <span>역할군 {ps.roles.length}개</span>
                        <span>·</span>
                        <span>시나리오 {ps.scenarios.length}개</span>
                      </div>
                    </div>
                    <Badge tone="purple">검수 필요</Badge>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}
