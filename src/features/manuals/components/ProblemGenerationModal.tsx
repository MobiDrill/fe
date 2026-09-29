import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import type { ManualDocument } from "@/features/manuals/model/manual.types"

// 문제 생성 단계별 진행률과 현재 처리 단계를 모달로 표시합니다.
type ProblemGenerationModalProps = {
  document: ManualDocument | null
  onClose: () => void
  onNotify: (message: string) => void
}

export default function ProblemGenerationModal(
  props: ProblemGenerationModalProps,
) {
  const { document } = props
  if (!document) return null
  {
    document &&
      (() => {
        const problemTitles = [
          "분대원 방독면 미착용 상태에서 경보 수신 시 대응",
          "오염 의심지역 진입 전 장비 점검 누락 상황",
          "분대원 1명 오염 노출 후 제독 절차 미이행",
          "경보 전파 실패로 인접 분대 미대응 상황",
          "분대장 부재 시 부분대장 지휘 전환 절차",
        ]
        const subSteps = [
          "제목 기반 문제 상황 상세 정의",
          "정의된 문제 & 교범 분석 데이터 기반 시나리오 생성 중",
          "시나리오별 필요한 역할군 분류 중",
          "각 역할군별 최적의 행동 답안 생성 중",
          "생성한 답안 평가 중",
        ]
        const problemStatus: ("완료" | "진행 중" | "대기")[] = [
          "완료",
          "완료",
          "진행 중",
          "대기",
          "대기",
        ]
        const currentProblemIndex = problemStatus.indexOf("진행 중")
        const currentSubStep = 2
        const completedProblems = problemStatus.filter(
          (s) => s === "완료",
        ).length
        const totalProgress = Math.round(
          ((completedProblems + currentSubStep / subSteps.length) /
            problemTitles.length) *
            100,
        )
        return (
          <div
            role="presentation"
            onClick={() => props.onClose()}
            className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-sm md:p-10"
          >
            <div
              role="dialog"
              aria-modal="true"
              onClick={(event) => event.stopPropagation()}
              className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                <div className="min-w-0 flex-1 pr-6">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge tone="blue">문제 생성 중</Badge>
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
                  onKeyDown={(event) =>
                    event.key === "Enter" && props.onClose()
                  }
                  className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <Icon name="plus" className="size-5 rotate-45" />
                </div>
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                <div className="border-b border-slate-100 px-6 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-black text-blue-700">
                        {totalProgress}%
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                        <span className="size-3 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></span>
                        문제 {currentProblemIndex + 1} ·{" "}
                        {subSteps[currentSubStep]}
                      </div>
                    </div>
                    <div className="shrink-0 text-xs font-semibold text-slate-400">
                      전체 {completedProblems}/{problemTitles.length}문제 완료
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{ width: `${totalProgress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="border-b border-slate-100 px-6 py-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
                      <Icon name="check" className="size-3.5" />
                    </span>
                    <div className="text-sm font-extrabold text-slate-900">
                      1단계 · 문제 목차 정의
                    </div>
                    <Badge tone="green">완료</Badge>
                  </div>
                  <p className="mb-3 text-xs text-slate-500">
                    개인/분대별로 도출될 수 있는 예상 상황들의 제목을
                    생성했습니다.
                  </p>
                  <div className="space-y-2">
                    {problemTitles.map((title, i) => (
                      <div
                        key={title}
                        className="flex items-start gap-2.5 rounded-lg bg-slate-50 px-3.5 py-2.5"
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-slate-200 text-[10px] font-black text-slate-500">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-700">
                          {title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">
                      2
                    </span>
                    <div className="text-sm font-extrabold text-slate-900">
                      2단계 · 문제별 상세 생성
                    </div>
                  </div>
                  <div className="space-y-3">
                    {problemTitles.map((title, i) => {
                      const status = problemStatus[i]
                      return (
                        <div
                          key={title}
                          className="overflow-hidden rounded-xl border border-slate-200"
                        >
                          <div
                            className={`flex items-center gap-3 px-4 py-3 ${
                              status === "진행 중"
                                ? "bg-blue-50"
                                : status === "완료"
                                  ? "bg-white"
                                  : "bg-slate-50"
                            }`}
                          >
                            <span
                              className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                                status === "완료"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : status === "진행 중"
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-200 text-slate-400"
                              }`}
                            >
                              {status === "완료" ? (
                                <Icon name="check" className="size-3.5" />
                              ) : (
                                i + 1
                              )}
                            </span>
                            <span
                              className={`flex-1 text-sm font-bold ${
                                status === "대기"
                                  ? "text-slate-400"
                                  : "text-slate-800"
                              }`}
                            >
                              {title}
                            </span>
                            <Badge
                              tone={
                                status === "완료"
                                  ? "green"
                                  : status === "진행 중"
                                    ? "blue"
                                    : "neutral"
                              }
                            >
                              {status}
                            </Badge>
                          </div>
                          {status === "진행 중" && (
                            <div className="divide-y divide-slate-100 border-t border-slate-100">
                              {subSteps.map((step, si) => {
                                const stepDone = si < currentSubStep
                                const stepActive = si === currentSubStep
                                return (
                                  <div
                                    key={step}
                                    className={`flex items-center gap-3 px-4 py-2.5 ${
                                      stepActive ? "bg-blue-50/60" : ""
                                    }`}
                                  >
                                    <span
                                      className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                                        stepDone
                                          ? "bg-emerald-100 text-emerald-600"
                                          : stepActive
                                            ? "bg-blue-200 text-blue-700"
                                            : "bg-slate-100 text-slate-300"
                                      }`}
                                    >
                                      {stepDone ? (
                                        <Icon name="check" className="size-3" />
                                      ) : (
                                        si + 1
                                      )}
                                    </span>
                                    <span
                                      className={`flex-1 text-xs font-semibold ${
                                        stepActive
                                          ? "text-blue-800"
                                          : stepDone
                                            ? "text-slate-500"
                                            : "text-slate-300"
                                      }`}
                                    >
                                      {step}
                                    </span>
                                    {stepActive && (
                                      <span className="size-3.5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></span>
                                    )}
                                    {stepDone && (
                                      <Icon
                                        name="check"
                                        className="size-3.5 text-emerald-500"
                                      />
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                          {status === "완료" && (
                            <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
                              모든 단계 완료 · 5개 역할군 답안 생성됨
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    props.onNotify(`${document.name} 문제 생성을 중단했습니다.`)
                    props.onClose()
                  }}
                >
                  중단하기
                </Button>
              </div>
            </div>
          </div>
        )
      })()
  }
}
