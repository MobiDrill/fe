import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import type { ManualDocument } from "@/features/manuals/model/manual.types"

// 검수가 필요한 교범의 요약 정보와 상세 검수 진입 동작을 제공하는 모달입니다.
type ReviewSummaryModalProps = {
  document: ManualDocument | null
  onClose: () => void
  onOpenReview: (document: ManualDocument) => void
}

export default function ReviewSummaryModal(props: ReviewSummaryModalProps) {
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
        aria-label="검수 필요 교범 상세 정보"
        onClick={(event) => event.stopPropagation()}
        className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="min-w-0 flex-1 pr-6">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="amber">검수 필요</Badge>
              <span className="text-xs font-semibold text-slate-400">
                AI 분석 완료
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
        <div className="border-b border-slate-100 p-6">
          <div className="mb-4 text-base font-extrabold text-slate-900">
            기본 정보
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-400">
                훈련 분야
              </div>
              <div className="mt-2 text-sm font-bold text-slate-700">
                {document.field}
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-400">
                최근 수정
              </div>
              <div className="mt-2 text-sm font-bold text-slate-700">
                {document.date}
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-400">등록자</div>
              <div className="mt-2 text-sm font-bold text-slate-700">
                김관리
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs font-semibold text-slate-400">
                파일 형식
              </div>
              <div className="mt-2 text-sm font-bold text-slate-700">
                {document.type}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-3 text-base font-extrabold text-slate-900">
              교범 설명
            </div>
            <div className="min-h-24 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
              오염지역에서 분대원이 수행해야 하는 역할과 행동 절차, 정보 공유
              방법 및 금지 행동을 정리한 교육 지침입니다.
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-3 text-base font-extrabold text-slate-900">
              첨부 파일
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Icon name="file" className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-slate-700">
                  {document.name}.{document.type.toLocaleLowerCase()}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  원본 교범 파일
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-base font-extrabold text-slate-900">
                분석 결과
              </div>
            </div>
          </div>
          <div className="max-h-96 space-y-3 overflow-y-auto pr-2">
            {[
              {
                title: "문서 구조 및 교육과목 분석",
                description: "교범의 목차와 교육 항목 구조",
                items: [
                  { label: "교육과목", value: `${document.field} 기본훈련` },
                  {
                    label: "교육 사항",
                    value:
                      "위협 및 기본 개념, 상황 식별, 개인 행동 절차, 분대 역할과 협업",
                  },
                ],
              },
              {
                title: "교육 목표 및 핵심 개념 추출",
                description: "교육 사항별 학습 구조",
                items: [
                  {
                    label: "교육 목표",
                    value:
                      "위협 식별, 상황별 행동 판단, 개인 역할 수행, 분대 단위 협업",
                  },
                  {
                    label: "핵심 개념",
                    value: "보호, 경보 전파, 오염 통제, 정보 공유",
                  },
                ],
              },
              {
                title: "발생 가능 상황 분석 및 추출",
                description: "상황 단위의 구성 구조",
                items: [
                  {
                    label: "상황",
                    value: "경보 수신, 오염 의심지역 진입, 분대원 노출",
                  },
                  {
                    label: "발생 조건",
                    value: "경보 발령, 오염 징후 식별, 보호 장비 이상 발생",
                  },
                ],
              },
              {
                title: "상황별 상세 지침 정의",
                description: "상황별 수행 및 평가 구조",
                items: [
                  {
                    label: "행동·순서",
                    value: "개인 보호 → 경보 전파 → 상황 보고 → 후속 조치",
                  },
                  { label: "역할", value: "분대장, 관측자, 전파 담당, 분대원" },
                  {
                    label: "주의·금지 행동",
                    value: "보호 장비 임의 해제 금지, 오염지역 이탈 절차 준수",
                  },
                  {
                    label: "평가기준",
                    value: "상황 인지, 필수 행동 수행, 역할 수행, 정보 공유",
                  },
                ],
              },
            ].map((section, index) => (
              <section
                key={section.title}
                className="rounded-xl border border-slate-200 p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-black text-white">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-extrabold">
                      {section.title}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">
                      {section.description}
                    </div>
                    <div className="mt-4 space-y-2">
                      {section.items.map((item) => (
                        <div
                          key={item.label}
                          className="grid gap-1 rounded-lg bg-slate-50 px-3 py-2.5 sm:grid-cols-[7rem_1fr] sm:gap-3"
                        >
                          <span className="text-xs font-bold text-slate-500">
                            {item.label}
                          </span>
                          <span className="text-xs font-medium leading-relaxed text-slate-700">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
          <Button
            icon="check"
            onClick={() => {
              props.onOpenReview(document)
            }}
          >
            검수하기
          </Button>
        </div>
      </div>
    </div>
  )
}
