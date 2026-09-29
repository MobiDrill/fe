import { useEffect, useRef, useState } from "react"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import { trainingFields } from "@/features/manuals/data/trainingFields"

// 신규 교범의 기본 정보와 원본 파일을 입력하는 등록 화면입니다.
export default function ManualRegistrationPage({
  onBack,
  onSave,
}: {
  onBack: () => void
  onSave: () => void
}) {
  const [selectedRegistrationField, setSelectedRegistrationField] = useState("")
  const [isRegistrationFieldOpen, setIsRegistrationFieldOpen] = useState(false)
  const registrationFieldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeFieldMenu = (event: PointerEvent) => {
      if (
        registrationFieldRef.current &&
        !registrationFieldRef.current.contains(event.target as Node)
      ) {
        setIsRegistrationFieldOpen(false)
      }
    }

    document.addEventListener("pointerdown", closeFieldMenu)
    return () => document.removeEventListener("pointerdown", closeFieldMenu)
  }, [])

  return (
    <div className="mx-auto max-w-5xl p-5 md:p-8">
      <div
        role="button"
        tabIndex={0}
        onClick={onBack}
        onKeyDown={(event) => event.key === "Enter" && onBack()}
        className="mb-7 inline-flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        <Icon name="chevron" className="size-4 rotate-180" />
        교범 관리로 돌아가기
      </div>

      <div className="mb-8">
        <div className="text-3xl font-black tracking-tight">교범 등록</div>
        <p className="mt-2 text-sm text-slate-500">
          새로운 훈련 교범과 기본 정보를 등록합니다.
        </p>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
          <div className="mb-4">
            <div className="text-lg font-extrabold">기본 정보</div>
            <p className="mt-1 text-sm text-slate-500">
              교범을 구분하고 관리하는 데 필요한 정보를 입력해 주세요.
            </p>
          </div>
          <div className="grid gap-4">
            <div>
              <div className="mb-2 text-sm font-bold text-slate-700">
                교범명 <span className="text-rose-500">*</span>
              </div>
              <div
                role="textbox"
                contentEditable
                suppressContentEditableWarning
                className="min-h-11 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400"
              ></div>
            </div>
            <div ref={registrationFieldRef} className="relative">
              <div className="mb-2 text-sm font-bold text-slate-700">
                훈련 분야 <span className="text-rose-500">*</span>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsRegistrationFieldOpen((open) => !open)}
                onKeyDown={(event) =>
                  event.key === "Enter" &&
                  setIsRegistrationFieldOpen((open) => !open)
                }
                className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-sm ${
                  isRegistrationFieldOpen
                    ? "border-slate-400"
                    : "border-slate-200"
                } ${
                  selectedRegistrationField
                    ? "font-semibold text-slate-700"
                    : "text-slate-400"
                }`}
              >
                {selectedRegistrationField || "분야를 선택해 주세요"}
                <Icon
                  name="chevron"
                  className={`size-4 transition-transform ${
                    isRegistrationFieldOpen ? "-rotate-90" : "rotate-90"
                  }`}
                />
              </div>
              {isRegistrationFieldOpen && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/70">
                  {trainingFields.slice(1).map((field) => (
                    <div
                      key={field}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedRegistrationField(field)
                        setIsRegistrationFieldOpen(false)
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          setSelectedRegistrationField(field)
                          setIsRegistrationFieldOpen(false)
                        }
                      }}
                      className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
                        selectedRegistrationField === field
                          ? "bg-slate-900 font-bold text-white"
                          : "font-medium text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {field}
                      {selectedRegistrationField === field && (
                        <Icon name="check" className="size-4" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="mb-2 text-sm font-bold text-slate-700">
                교범 설명
              </div>
              <div
                role="textbox"
                contentEditable
                suppressContentEditableWarning
                className="min-h-20 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400"
              ></div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
          <div className="mb-6">
            <div className="text-lg font-extrabold">교범 파일</div>
            <p className="mt-1 text-sm text-slate-500">
              AI 지식 추출에 사용할 원본 자료를 첨부해 주세요.
            </p>
          </div>
          <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center transition-colors hover:border-slate-400 hover:bg-slate-100">
            <div className="flex size-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
              <Icon name="upload" />
            </div>
            <div className="mt-4 text-sm font-extrabold">
              파일을 끌어다 놓거나 선택하세요
            </div>
            <p className="mt-2 text-xs text-slate-400">
              PDF, PPT, PPTX, DOCX 형식 · 파일당 최대 100MB
            </p>
            <div className="mt-5">
              <Button variant="secondary">파일 선택</Button>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
        <Button variant="secondary" onClick={onBack}>
          취소
        </Button>
        <Button icon="check" onClick={onSave}>
          저장
        </Button>
      </div>
    </div>
  )
}
