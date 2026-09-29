import { useState } from "react"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import { problemSections } from "@/features/manuals/data/problemSections.mock"
import type { ManualDocument } from "@/features/manuals/model/manual.types"

// 생성된 문제를 항목별로 확인하고 임시 저장 또는 승인하는 검수 화면입니다.
export default function ProblemReviewPage({
  document,
  initialCompleted = 0,
  initialSection = 0,
  onBack,
  onApprove,
  onSaveDraft,
}: {
  document: ManualDocument
  initialCompleted?: number
  initialSection?: number
  onBack: () => void
  onApprove: () => void
  onSaveDraft?: (completed: number, current: number) => void
}) {
  const [currentSection, setCurrentSection] = useState(initialSection)
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(true)
  const [openAnalysisIndex, setOpenAnalysisIndex] = useState<number | null>(
    null,
  )
  const [completedSections, setCompletedSections] = useState<number[]>(
    Array.from({ length: initialCompleted }, (_, i) => i),
  )

  const sections = problemSections
  const section = sections[currentSection]

  const completeAndContinue = () => {
    const newCompleted = completedSections.includes(currentSection)
      ? completedSections
      : [...completedSections, currentSection]
    setCompletedSections(newCompleted)
    if (currentSection < sections.length - 1) {
      setCurrentSection((c) => c + 1)
    } else {
      onApprove()
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-200 bg-white px-5 py-5 md:px-8">
        <div
          role="button"
          tabIndex={0}
          onClick={onBack}
          onKeyDown={(event) => event.key === "Enter" && onBack()}
          className="mb-4 inline-flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
        >
          <Icon name="chevron" className="size-4 rotate-180" />
          교범 관리로 돌아가기
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="purple">문제 검수</Badge>
              <span className="text-xs font-semibold text-slate-400">
                {document.field}
              </span>
            </div>
            <div className="text-2xl font-black">{document.name}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-500">
              {currentSection + 1} / {sections.length}
            </span>
            <Button
              variant="secondary"
              onClick={() =>
                onSaveDraft?.(completedSections.length, currentSection)
              }
            >
              검수 임시 저장
            </Button>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white px-5 py-6 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="mt-1 text-sm font-extrabold text-slate-800">
                문제 {section.no} · {section.title}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold transition-opacity ${
                  section.type === "개인"
                    ? "bg-blue-50 text-blue-700 opacity-100"
                    : "bg-blue-50 text-blue-700 opacity-25"
                }`}
              >
                개인 단위
              </span>
              <span
                className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold transition-opacity ${
                  section.type === "분대"
                    ? "bg-violet-50 text-violet-700 opacity-100"
                    : "bg-violet-50 text-violet-700 opacity-25"
                }`}
              >
                분대 단위
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row">
            <div
              className="relative flex-1 overflow-hidden rounded-xl bg-slate-900 shadow-lg"
              style={{ aspectRatio: "16/9" }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                  <svg
                    className="size-7 translate-x-0.5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-white">
                    상황 설명 영상
                  </div>
                  <div className="mt-1 text-xs text-white/50">
                    AI 생성 · {section.type} 훈련 시나리오
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-8">
                <div className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30">
                  <svg
                    className="size-4 translate-x-0.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="h-1 overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-0 rounded-full bg-white"></div>
                  </div>
                </div>
                <span className="text-xs font-semibold tabular-nums text-white/70">
                  0:00 / 2:34
                </span>
                <div className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30">
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 lg:w-56">
              <div className="text-xs font-bold text-slate-400">
                문제별 영상
              </div>
              {problemSections.map((ps) => {
                const isCurrent = ps.no === section.no
                return (
                  <div
                    key={ps.no}
                    role="button"
                    tabIndex={0}
                    onClick={() => setCurrentSection(ps.no - 1)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setCurrentSection(ps.no - 1)
                    }
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                      isCurrent
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-md ${
                        isCurrent ? "bg-white/15" : "bg-slate-100"
                      }`}
                    >
                      {completedSections.includes(ps.no - 1) ? (
                        <Icon
                          name="check"
                          className={`size-4 ${
                            isCurrent ? "text-emerald-300" : "text-emerald-600"
                          }`}
                        />
                      ) : (
                        <svg
                          className={`size-4 translate-x-0.5 ${
                            isCurrent ? "text-white" : "text-slate-500"
                          }`}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`truncate text-xs font-bold ${
                          isCurrent ? "text-white" : "text-slate-700"
                        }`}
                      >
                        문제 {ps.no}
                      </div>
                      <div
                        className={`truncate text-[10px] ${
                          isCurrent ? "text-white/60" : "text-slate-400"
                        }`}
                      >
                        {ps.type} · 2:34
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen flex-col xl:flex-row">
        <section className="min-w-0 flex-1 bg-white p-5 md:p-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold tracking-widest text-slate-400">
                  AI 생성 문제 · {currentSection + 1}/{sections.length}
                </div>
                <div className="mt-2 text-2xl font-black">{section.title}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge tone={section.type === "개인" ? "blue" : "purple"}>
                  {section.type} 단위
                </Badge>
                {!isAnalysisOpen && (
                  <Button
                    variant="secondary"
                    onClick={() => setIsAnalysisOpen(true)}
                  >
                    분석 보기
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-xs font-black text-slate-500">
                    1
                  </span>
                  <span className="text-sm font-extrabold">상황 설명</span>
                </div>
                <div className="space-y-2">
                  <div className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-2.5">
                      <span className="flex size-5 items-center justify-center rounded bg-violet-100 text-[10px] font-black text-violet-600">
                        영
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        영상 생성용 상세 시나리오
                      </span>
                    </div>
                    <div
                      role="textbox"
                      contentEditable
                      suppressContentEditableWarning
                      className="min-h-16 px-4 py-3 text-sm font-medium leading-relaxed text-slate-700 outline-none ring-inset ring-slate-300 focus:bg-white focus:ring-1"
                    >
                      {section.situationVideo}
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-2.5">
                      <span className="flex size-5 items-center justify-center rounded bg-blue-100 text-[10px] font-black text-blue-600">
                        평
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        개념 및 교본 내용 이해 평가용
                      </span>
                    </div>
                    <div
                      role="textbox"
                      contentEditable
                      suppressContentEditableWarning
                      className="min-h-16 px-4 py-3 text-sm font-medium leading-relaxed text-slate-700 outline-none ring-inset ring-slate-300 focus:bg-white focus:ring-1"
                    >
                      {section.situationEval}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-xs font-black text-slate-500">
                    2
                  </span>
                  <span className="text-sm font-extrabold">훈련 목표</span>
                </div>
                <div
                  role="textbox"
                  contentEditable
                  suppressContentEditableWarning
                  className="min-h-10 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium leading-relaxed text-slate-700 outline-none ring-slate-300 focus:bg-white focus:ring-1"
                >
                  {section.objective}
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 p-5">
                  <span className="flex size-6 items-center justify-center rounded-md bg-slate-900 text-xs font-black text-white">
                    3
                  </span>
                  <span className="text-sm font-extrabold">
                    생성된 문제 (예비군 표시용)
                  </span>
                </div>
                <div className="mx-5 mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
                    <div className="mb-1 text-[10px] font-bold tracking-widest text-slate-400">
                      상황
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-slate-700">
                      {section.generatedQuestion.situation}
                    </p>
                  </div>
                  <div className="px-5 py-4">
                    <div className="mb-3 text-sm font-extrabold text-slate-900">
                      {section.generatedQuestion.question}
                    </div>
                    <div className="space-y-2">
                      {section.generatedQuestion.options.map((option, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${
                            i === section.generatedQuestion.correctIndex
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-slate-100 bg-slate-50"
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                              i === section.generatedQuestion.correctIndex
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span
                            className={`text-sm leading-relaxed ${
                              i === section.generatedQuestion.correctIndex
                                ? "font-semibold text-emerald-800"
                                : "font-medium text-slate-700"
                            }`}
                          >
                            {option}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                      <div className="mb-1 text-[10px] font-bold tracking-widest text-blue-500">
                        해설
                      </div>
                      <p className="text-xs font-medium leading-relaxed text-blue-800">
                        {section.generatedQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-xs font-black text-slate-500">
                    4
                  </span>
                  <span className="text-sm font-extrabold">
                    역할군 및 행동 답안
                  </span>
                  <Badge tone="neutral">{section.roles.length}개 역할</Badge>
                </div>
                <div className="space-y-2">
                  {section.roles.map((role, i) => (
                    <div
                      key={role.role}
                      className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50"
                    >
                      <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-2.5">
                        <span className="flex size-5 items-center justify-center rounded bg-slate-200 text-[10px] font-black text-slate-500">
                          {i + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          {role.role}
                        </span>
                      </div>
                      <div
                        role="textbox"
                        contentEditable
                        suppressContentEditableWarning
                        className="min-h-10 px-4 py-3 text-sm font-medium leading-relaxed text-slate-700 outline-none ring-inset ring-slate-300 focus:bg-white focus:ring-1"
                      >
                        {role.action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-xs font-black text-slate-500">
                    5
                  </span>
                  <span className="text-sm font-extrabold">시나리오</span>
                  <Badge tone="neutral">{section.scenarios.length}개</Badge>
                </div>
                <div className="space-y-2">
                  {section.scenarios.map((scenario, i) => (
                    <div
                      key={scenario.label}
                      className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50"
                    >
                      <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-2.5">
                        <span className="flex size-5 items-center justify-center rounded bg-slate-200 text-[10px] font-black text-slate-500">
                          {i + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          {scenario.label}
                        </span>
                      </div>
                      <div
                        role="textbox"
                        contentEditable
                        suppressContentEditableWarning
                        className="min-h-10 px-4 py-3 text-sm font-medium leading-relaxed text-slate-700 outline-none ring-inset ring-slate-300 focus:bg-white focus:ring-1"
                      >
                        {scenario.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-xs font-black text-slate-500">
                    6
                  </span>
                  <span className="text-sm font-extrabold">평가 기준</span>
                </div>
                <div className="space-y-2">
                  {section.evalCriteria.map((criterion, i) => (
                    <div
                      key={criterion}
                      className="flex items-start gap-3 rounded-lg bg-slate-50 px-4 py-3"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-slate-200 text-[10px] font-black text-slate-500">
                        {i + 1}
                      </span>
                      <div
                        role="textbox"
                        contentEditable
                        suppressContentEditableWarning
                        className="flex-1 text-sm font-medium leading-relaxed text-slate-700 outline-none focus:bg-white"
                      >
                        {criterion}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
              <Button
                variant="secondary"
                onClick={() =>
                  currentSection > 0 && setCurrentSection((c) => c - 1)
                }
              >
                이전 문제
              </Button>
              <Button icon="check" onClick={completeAndContinue}>
                {currentSection === sections.length - 1
                  ? "검수 완료"
                  : "이 문제 승인 후 다음"}
              </Button>
            </div>
          </div>
        </section>

        {isAnalysisOpen && (
          <aside className="sticky top-0 h-screen w-full shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-100 p-5 xl:w-2/5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-base font-extrabold">AI 분석 결과</div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsAnalysisOpen(false)}
                onKeyDown={(event) =>
                  event.key === "Enter" && setIsAnalysisOpen(false)
                }
                className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200"
              >
                <Icon name="plus" className="size-5 rotate-45" />
              </div>
            </div>
            <div className="space-y-2">
              {reviewSections.map((sec, index) => {
                const isOpen = openAnalysisIndex === index
                return (
                  <div
                    key={sec.title}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        setOpenAnalysisIndex(isOpen ? null : index)
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        setOpenAnalysisIndex(isOpen ? null : index)
                      }
                      className="flex cursor-pointer items-center gap-2.5 px-4 py-3"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-900 text-[10px] font-black text-white">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1 text-xs font-extrabold text-slate-800">
                        {sec.title}
                      </div>
                      <Icon
                        name="chevron"
                        className={`size-4 shrink-0 text-slate-400 transition-transform ${
                          isOpen ? "-rotate-90" : "rotate-90"
                        }`}
                      />
                    </div>
                    {isOpen && (
                      <div className="space-y-2 border-t border-slate-100 px-3 py-3">
                        {sec.rows.map((row) => (
                          <div
                            key={row.label}
                            className="overflow-hidden rounded-lg border border-slate-100"
                          >
                            <div className="border-b border-slate-100 bg-slate-50 px-3 py-2">
                              <span className="text-xs font-bold text-slate-500">
                                {row.label}
                              </span>
                            </div>
                            {row.subItems ? (
                              <div className="divide-y divide-slate-100">
                                {row.subItems.map((sub, subIndex) => (
                                  <div
                                    key={sub.label}
                                    className="grid gap-2 px-3 py-2.5 sm:grid-cols-[7rem_1fr] sm:gap-3"
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <span className="flex size-4 shrink-0 items-center justify-center rounded bg-slate-200 text-[9px] font-black text-slate-500">
                                        {subIndex + 1}
                                      </span>
                                      <span className="text-xs font-semibold text-slate-500">
                                        {sub.label}
                                      </span>
                                    </div>
                                    <span className="text-xs font-medium leading-relaxed text-slate-700">
                                      {sub.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="px-3 py-2.5">
                                <span className="text-xs font-medium leading-relaxed text-slate-700">
                                  {row.value}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-violet-700">
                    문제 생성 근거
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-violet-800">
                  위 분석 결과를 바탕으로 교육 목표 달성 여부를 평가할 수 있는{" "}
                  {problemSections.length}개의 실전 상황 문제가 생성되었습니다.
                  개인 단위{" "}
                  {problemSections.filter((p) => p.type === "개인").length}개,
                  분대 단위{" "}
                  {problemSections.filter((p) => p.type === "분대").length}개로
                  구성됩니다.
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
