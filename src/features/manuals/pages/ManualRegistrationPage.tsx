import { useRef, useState, type FormEvent } from "react"
import Icon from "@/components/ui/Icon"
import {
  MANUAL_FILE_ACCEPT,
  registerManual,
  validateManualFile,
  type ManualRegisterResponse,
} from "@/features/manuals/api/manuals.api"
import { errorMessage } from "@/lib/api/http"
import type { TrainingField } from "@/features/training-fields/model/trainingFields"

export default function ManualRegistrationPage({
  onBack,
  onSave,
  trainingFields,
  fieldsLoading = false,
  fieldsError = "",
  onReloadFields,
}: {
  onBack: () => void
  onSave: (manual: ManualRegisterResponse) => void
  trainingFields: TrainingField[]
  fieldsLoading?: boolean
  fieldsError?: string
  onReloadFields?: () => void
}) {
  const [title, setTitle] = useState("")
  const [fieldId, setFieldId] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const activeFields = trainingFields.filter((field) => field.isActive)
  const submitting = useRef(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const inputClass =
    "w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400"
  const buttonClass =
    "rounded-lg px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"

  const selectFiles = (files: FileList | null) => {
    if (!files?.length || submitting.current) return
    if (files.length !== 1) {
      setError("교범 원본 파일은 1개만 선택해 주세요.")
      return
    }
    const selected = files[0]
    const validation = validateManualFile(selected)
    if (validation) {
      setError(validation)
      return
    }
    setFile(selected)
    setError("")
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitting.current) return
    const trainingFieldId = Number(fieldId)
    if (!title.trim() || title.trim().length > 100) {
      setError("교범명은 1~100자로 입력해 주세요.")
      return
    }
    if (
      !/^\d+$/.test(fieldId) ||
      !Number.isSafeInteger(trainingFieldId) ||
      trainingFieldId <= 0 ||
      fieldsLoading ||
      !!fieldsError ||
      !activeFields.some((field) => field.trainingFieldId === trainingFieldId)
    ) {
      setError("활성 훈련 분야를 선택해 주세요.")
      return
    }
    if (description.length > 1000) {
      setError("교범 설명은 1000자 이내로 입력해 주세요.")
      return
    }
    const fileError = file
      ? validateManualFile(file)
      : "교범 원본 파일을 선택해 주세요."
    if (fileError || !file) {
      setError(fileError ?? "교범 원본 파일을 선택해 주세요.")
      return
    }
    submitting.current = true
    setSaving(true)
    setError("")
    try {
      const manual = await registerManual(
        {
          manualTitle: title.trim(),
          trainingFieldId,
          manualDescription: description.trim() || undefined,
        },
        file,
      )
      onSave(manual)
    } catch (failure) {
      setError(errorMessage(failure))
    } finally {
      submitting.current = false
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-5 md:p-8">
      <button
        type="button"
        disabled={saving}
        onClick={onBack}
        className="mb-7 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
      >
        <Icon name="chevron" className="size-4 rotate-180" />
        교범 관리로 돌아가기
      </button>
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">교범 등록</h1>
        <p className="mt-2 text-sm text-slate-500">
          새로운 훈련 교범과 기본 정보를 등록합니다.
        </p>
      </div>
      <form onSubmit={submit} noValidate aria-busy={saving}>
        <fieldset disabled={saving} className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
            <h2 className="text-lg font-extrabold">기본 정보</h2>
            <p className="mb-4 mt-1 text-sm text-slate-500">
              교범을 구분하고 관리하는 데 필요한 정보를 입력해 주세요.
            </p>
            <div className="grid gap-4">
              <div>
                <label
                  htmlFor="manual-title"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  교범명 <span className="text-rose-500">*</span>
                </label>
                <input
                  id="manual-title"
                  required
                  maxLength={100}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="manual-field"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  훈련 분야 <span className="text-rose-500">*</span>
                </label>
                <select
                  id="manual-field"
                  required
                  disabled={fieldsLoading || !!fieldsError}
                  value={fieldId}
                  onChange={(event) => setFieldId(event.target.value)}
                  aria-describedby="manual-field-help"
                  className={inputClass}
                >
                  <option value="">분야를 선택해 주세요</option>
                  {activeFields.map((field) => (
                    <option
                      key={field.trainingFieldId}
                      value={field.trainingFieldId}
                    >
                      {field.name}
                    </option>
                  ))}
                </select>
                <p
                  id="manual-field-help"
                  className="mt-2 text-xs text-slate-500"
                >
                  {fieldsLoading
                    ? "훈련 분야를 불러오고 있습니다…"
                    : "활성 훈련 분야만 선택할 수 있습니다."}
                </p>
                {fieldsError && (
                  <div className="mt-2">
                    <p role="alert" className="text-sm text-rose-600">
                      {fieldsError}
                    </p>
                    <button
                      type="button"
                      onClick={onReloadFields}
                      className="mt-2 text-sm font-bold"
                    >
                      다시 시도
                    </button>
                  </div>
                )}
                {!fieldsLoading &&
                  !fieldsError &&
                  activeFields.length === 0 && (
                    <p className="mt-2 text-sm text-amber-700">
                      등록 가능한 활성 분야가 없습니다. 훈련 분야 관리에서
                      분야를 등록하거나 활성화해 주세요.
                    </p>
                  )}
              </div>
              <div>
                <label
                  htmlFor="manual-description"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  교범 설명
                </label>
                <textarea
                  id="manual-description"
                  maxLength={1000}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className={`${inputClass} min-h-20`}
                />
              </div>
            </div>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
            <h2 className="text-lg font-extrabold">
              교범 파일 <span className="text-rose-500">*</span>
            </h2>
            <p className="mb-6 mt-1 text-sm text-slate-500">
              AI 지식 추출에 사용할 원본 자료를 첨부해 주세요.
            </p>
            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                selectFiles(event.dataTransfer.files)
              }}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center transition-colors hover:border-slate-400"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
                <Icon name="upload" />
              </div>
              <div className="mt-4 text-sm font-extrabold">
                파일을 끌어다 놓거나 선택하세요
              </div>
              <p className="mt-2 text-xs text-slate-400">
                PDF, PPT, PPTX, DOC, DOCX, HWP 5 형식 · 최대 50MB · 파일 1개
              </p>
              <input
                ref={fileInput}
                type="file"
                accept={MANUAL_FILE_ACCEPT}
                aria-label="교범 원본 파일"
                className="sr-only"
                onChange={(event) => {
                  selectFiles(event.target.files)
                  event.target.value = ""
                }}
              />
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className={`${buttonClass} mt-5 border border-slate-200 bg-white text-slate-700`}
              >
                파일 선택
              </button>
              {file && (
                <div className="mt-4 flex max-w-full items-center gap-3 text-sm text-slate-700">
                  <span className="break-all">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                  </span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="shrink-0 font-semibold text-rose-600"
                  >
                    첨부 삭제
                  </button>
                </div>
              )}
            </div>
          </section>
        </fieldset>
        {error && (
          <p role="alert" className="mt-5 text-sm text-rose-600">
            {error}
          </p>
        )}
        {saving && (
          <p role="status" className="mt-5 text-sm text-slate-500">
            교범을 등록하고 있습니다…
          </p>
        )}
        <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
          <button
            type="button"
            disabled={saving}
            onClick={onBack}
            className={`${buttonClass} border border-slate-200 bg-white text-slate-700`}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={
              saving ||
              fieldsLoading ||
              !!fieldsError ||
              activeFields.length === 0
            }
            className={`${buttonClass} inline-flex items-center gap-2 bg-slate-900 text-white`}
          >
            <Icon name="check" className="size-4" />
            {saving ? "등록 중…" : "저장"}
          </button>
        </div>
      </form>
    </div>
  )
}
