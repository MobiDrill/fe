import { useState } from "react"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import { reviewSections } from "@/features/manuals/data/reviewSections.mock"
import type { ManualDocument } from "@/features/manuals/model/manual.types"

// 교범에서 추출한 지식 섹션을 원문과 비교하고 승인하는 검수 화면입니다.
export default function ManualReviewPage({
  document,
  initialCompleted = 0,
  initialSection = 0,
  onBack,
  onApprove,
  onProgress,
  onSaveDraft,
}: {
  document: ManualDocument
  initialCompleted?: number
  initialSection?: number
  onBack: () => void
  onApprove: () => void
  onProgress?: (completed: number, total: number) => void
  onSaveDraft?: (completed: number, current: number) => void
}) {
  const [currentSection, setCurrentSection] = useState(initialSection)
  const [isSourceOpen, setIsSourceOpen] = useState(true)
  const [completedSections, setCompletedSections] = useState<number[]>(
    Array.from({ length: initialCompleted }, (_, i) => i),
  )

  const sections = reviewSections
  const section = sections[currentSection]
  const completeAndContinue = () => {
    const newCompleted = completedSections.includes(currentSection)
      ? completedSections
      : [...completedSections, currentSection]
    setCompletedSections(newCompleted)
    onProgress?.(newCompleted.length, sections.length)
    if (currentSection < sections.length - 1) {
      setCurrentSection((current) => current + 1)
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
              <Badge tone="amber">상세 검수</Badge>
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

      <div className="border-b border-slate-200 bg-white px-5 md:px-8">
        <div className="flex overflow-x-auto">
          {sections.map((item, index) => {
            const isCompleted = completedSections.includes(index)
            const isCurrent = currentSection === index
            return (
              <div
                key={item.title}
                role="button"
                tabIndex={0}
                onClick={() =>
                  (isCompleted || index <= currentSection) &&
                  setCurrentSection(index)
                }
                className={`flex min-w-40 items-center gap-2 border-b-2 px-4 py-4 text-sm font-bold ${
                  isCurrent
                    ? "border-slate-900 text-slate-900"
                    : isCompleted
                      ? "cursor-pointer border-transparent text-emerald-700"
                      : "cursor-not-allowed border-transparent text-slate-300"
                }`}
              >
                <span
                  className={`flex size-6 items-center justify-center rounded-full text-xs ${
                    isCompleted
                      ? "bg-emerald-100 text-emerald-700"
                      : isCurrent
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <Icon name="check" className="size-3.5" />
                  ) : (
                    index + 1
                  )}
                </span>
                {item.shortTitle}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex min-h-screen flex-col xl:flex-row">
        <section className="min-w-0 flex-1 bg-white p-5 md:p-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold tracking-widest text-slate-400">
                  AI 생성 내용 · 목차 {currentSection + 1}
                </div>
                <div className="mt-2 text-2xl font-black">{section.title}</div>
              </div>
              {!isSourceOpen && (
                <Button
                  variant="secondary"
                  icon="book"
                  onClick={() => setIsSourceOpen(true)}
                >
                  원본 보기
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {section.rows.map((row, index) => (
                <div
                  key={row.label}
                  className="rounded-xl border border-slate-200 p-5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-md bg-slate-100 text-xs font-black text-slate-500">
                        {index + 1}
                      </span>
                      <span className="text-sm font-extrabold">
                        {row.label}
                      </span>
                    </div>
                    <Badge tone="blue">{section.source}</Badge>
                  </div>
                  {row.subItems ? (
                    <div className="space-y-2">
                      {row.subItems.map((sub, subIndex) => (
                        <div
                          key={sub.label}
                          className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50"
                        >
                          <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-4 py-2.5">
                            <span className="flex size-5 items-center justify-center rounded bg-slate-200 text-[10px] font-black text-slate-500">
                              {subIndex + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-600">
                              {sub.label}
                            </span>
                          </div>
                          <div
                            role="textbox"
                            contentEditable
                            suppressContentEditableWarning
                            className="min-h-10 px-4 py-3 text-sm font-medium leading-relaxed text-slate-700 outline-none ring-inset ring-slate-300 focus:bg-white focus:ring-1"
                          >
                            {sub.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      role="textbox"
                      contentEditable
                      suppressContentEditableWarning
                      className="min-h-16 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium leading-relaxed text-slate-700 outline-none ring-slate-300 focus:bg-white focus:ring-1"
                    >
                      {row.value}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
              <Button
                variant="secondary"
                onClick={() =>
                  currentSection > 0 &&
                  setCurrentSection((current) => current - 1)
                }
              >
                이전 목차
              </Button>
              <Button icon="check" onClick={completeAndContinue}>
                {currentSection === sections.length - 1
                  ? "검수 완료"
                  : "이 목차 승인 후 다음"}
              </Button>
            </div>
          </div>
        </section>

        {isSourceOpen && (
          <aside className="w-full shrink-0 border-l border-slate-200 bg-slate-100 p-5 xl:w-2/5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-base font-extrabold">실제 원본 데이터</div>
                <div className="mt-1 text-xs text-slate-500">
                  {section.source} · {document.name}.pdf
                </div>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsSourceOpen(false)}
                onKeyDown={(event) =>
                  event.key === "Enter" && setIsSourceOpen(false)
                }
                className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200"
              >
                <Icon name="plus" className="size-5 rotate-45" />
              </div>
            </div>
            <div className="rounded-xl bg-slate-700 p-5 shadow-inner">
              <div className="mx-auto min-h-screen max-w-xl bg-white p-8 shadow-xl">
                <div className="border-b-2 border-slate-900 pb-5">
                  <div className="text-xs font-bold tracking-widest text-slate-500">
                    교육훈련 교범
                  </div>
                  <div className="mt-3 text-xl font-black">
                    {document.field} 기본훈련
                  </div>
                </div>
                <div className="mt-8">
                  <div className="text-lg font-extrabold">
                    {section.sourceHeading}
                  </div>
                  <div className="mt-5 space-y-5 text-sm leading-loose text-slate-700">
                    {section.sourceText.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
                <div className="mt-12 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
                  {section.source}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
