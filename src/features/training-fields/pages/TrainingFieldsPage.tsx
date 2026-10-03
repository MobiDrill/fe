import { useId, useRef, useState, type FormEvent } from "react"
import Icon from "@/components/ui/Icon"
import { errorMessage } from "@/lib/api/http"
import type { TrainingField, TrainingFieldInput } from "../model/trainingFields"

type Props = {
  fields: TrainingField[]
  loading: boolean
  loadError: string
  onReload: () => void
  onCreate: (input: TrainingFieldInput) => Promise<void>
  onUpdate: (id: number, input: TrainingFieldInput) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onNotify: (message: string) => void
}
const primary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
const secondary =
  "rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
const input =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"

export default function TrainingFieldsPage({
  fields,
  loading,
  loadError,
  onReload,
  onCreate,
  onUpdate,
  onDelete,
  onNotify,
}: Props) {
  const [query, setQuery] = useState("")
  const [draft, setDraft] = useState<TrainingFieldInput>({
    name: "",
    isActive: true,
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<TrainingField | null>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  const editor = useRef<HTMLDialogElement>(null)
  const confirmation = useRef<HTMLDialogElement>(null)
  const formId = useId()
  const visibleFields = fields.filter((field) =>
    field.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  )
  const openEditor = (field?: TrainingField) => {
    setEditingId(field?.trainingFieldId ?? null)
    setDraft({ name: field?.name ?? "", isActive: field?.isActive ?? true })
    setError("")
    editor.current?.showModal()
  }
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (pending.current) return
    const name = draft.name.trim()
    if (!name || draft.name.length > 100) {
      setError("분야명은 1~100자로 입력해 주세요.")
      return
    }
    pending.current = true
    setBusy(true)
    setError("")
    try {
      const saved = { name, isActive: draft.isActive }
      if (editingId === null) await onCreate(saved)
      else await onUpdate(editingId, saved)
      editor.current?.close()
      onNotify(
        editingId === null
          ? "훈련 분야를 등록했습니다."
          : "훈련 분야를 수정했습니다.",
      )
    } catch (failure) {
      setError(errorMessage(failure))
    } finally {
      pending.current = false
      setBusy(false)
    }
  }
  const remove = async () => {
    if (!deleting || pending.current) return
    pending.current = true
    setBusy(true)
    setError("")
    try {
      await onDelete(deleting.trainingFieldId)
      confirmation.current?.close()
      onNotify("훈련 분야를 삭제했습니다.")
    } catch (failure) {
      setError(errorMessage(failure))
    } finally {
      pending.current = false
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-5 md:p-8">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight">훈련 분야 관리</h1>
          <p className="mt-2 text-sm text-slate-500">
            교범을 분류할 훈련 분야를 등록하고 관리합니다.
          </p>
        </div>
        <button
          type="button"
          className={primary}
          disabled={loading || !!loadError || busy}
          onClick={() => openEditor()}
        >
          <Icon name="plus" className="size-4" />
          훈련 분야 등록
        </button>
      </div>
      {loading && (
        <p role="status" className="mb-4 text-sm text-slate-500">
          훈련 분야를 불러오고 있습니다…
        </p>
      )}
      {loadError && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg bg-amber-50 p-4">
          <p role="alert" className="text-sm text-amber-800">
            {loadError}
          </p>
          <button type="button" className={secondary} onClick={onReload}>
            다시 시도
          </button>
        </div>
      )}
      <section
        aria-label="훈련 분야 목록"
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40"
      >
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
          <p className="text-sm font-semibold text-slate-500">
            전체 훈련 분야{" "}
            <span className="ml-2 text-lg font-black text-slate-900">
              {fields.length}
            </span>
          </p>
          <div className="relative sm:w-80">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3 top-3 size-4 text-slate-400"
            />
            <input
              aria-label="훈련 분야 검색"
              placeholder="분야명 검색"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={`${input} pl-10`}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-4">
                  ID
                </th>
                <th scope="col" className="px-5 py-4">
                  훈련 분야명
                </th>
                <th scope="col" className="px-5 py-4">
                  상태
                </th>
                <th scope="col" className="px-5 py-4 text-right">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleFields.map((field) => (
                <tr
                  key={field.trainingFieldId}
                  className="hover:bg-slate-50/70"
                >
                  <td className="px-5 py-5 text-slate-500">
                    {field.trainingFieldId}
                  </td>
                  <th
                    scope="row"
                    className="max-w-80 break-words px-5 py-5 font-bold text-slate-800"
                  >
                    {field.name}
                  </th>
                  <td className="px-5 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        field.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {field.isActive ? "활성" : "비활성"}
                    </span>
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled={busy || loading}
                        aria-label={`${field.name} 수정`}
                        className={secondary}
                        onClick={() => openEditor(field)}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        disabled={busy || loading}
                        aria-label={`${field.name} 삭제`}
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                        onClick={() => {
                          setDeleting(field)
                          setError("")
                          confirmation.current?.showModal()
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !loadError && visibleFields.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-16 text-center text-slate-400"
                  >
                    {query.trim()
                      ? "검색 결과가 없습니다."
                      : "등록된 훈련 분야가 없습니다. 새 분야를 등록해 주세요."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-400">
          총 {visibleFields.length}개 · 비활성 분야는 새 교범 등록 시 선택할 수
          없습니다.
        </div>
      </section>
      <dialog
        ref={editor}
        onCancel={(event) => {
          if (pending.current) event.preventDefault()
        }}
        aria-labelledby={`${formId}-title`}
        className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl backdrop:bg-slate-950/40"
      >
        <h2 id={`${formId}-title`} className="text-xl font-extrabold">
          훈련 분야 {editingId === null ? "등록" : "수정"}
        </h2>
        <form
          onSubmit={submit}
          noValidate
          aria-busy={busy}
          className="mt-6 space-y-5"
        >
          <div>
            <label
              htmlFor={`${formId}-name`}
              className="mb-2 block text-sm font-bold"
            >
              분야명 <span className="text-rose-500">*</span>
            </label>
            <input
              id={`${formId}-name`}
              autoFocus
              required
              disabled={busy}
              maxLength={100}
              value={draft.name}
              onChange={(event) => {
                setDraft((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
                setError("")
              }}
              className={input}
              placeholder="예: 통신 훈련"
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              disabled={busy}
              checked={draft.isActive}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  isActive: event.target.checked,
                }))
              }
            />
            활성 분야
          </label>
          <p className="text-xs text-slate-500">
            비활성으로 변경해도 기존 교범의 분야 연결은 유지됩니다.
          </p>
          {error && (
            <p role="alert" className="text-sm text-rose-600">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              disabled={busy}
              className={secondary}
              onClick={() => editor.current?.close()}
            >
              취소
            </button>
            <button type="submit" disabled={busy} className={primary}>
              {busy ? "저장 중…" : editingId === null ? "등록" : "수정 저장"}
            </button>
          </div>
        </form>
      </dialog>
      <dialog
        ref={confirmation}
        onCancel={(event) => {
          if (pending.current) event.preventDefault()
        }}
        aria-labelledby={`${formId}-delete`}
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl backdrop:bg-slate-950/40"
      >
        <h2 id={`${formId}-delete`} className="text-xl font-extrabold">
          훈련 분야 삭제
        </h2>
        <p className="mt-4 break-words text-sm leading-6 text-slate-600">
          “{deleting?.name}” 분야를 삭제하시겠습니까? 연결된 교범의 분야 연결은
          해제되며 교범과 원본 파일은 보존됩니다.
        </p>
        {error && (
          <p role="alert" className="mt-4 text-sm text-rose-600">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            autoFocus
            disabled={busy}
            className={secondary}
            onClick={() => confirmation.current?.close()}
          >
            취소
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              void remove()
            }}
            className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {busy ? "삭제 중…" : "삭제"}
          </button>
        </div>
      </dialog>
    </div>
  )
}
