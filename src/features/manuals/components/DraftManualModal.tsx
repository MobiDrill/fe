import { useState } from "react"
import Badge from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import type { ManualDocument } from "@/features/manuals/model/manual.types"

// 임시 저장된 교범 정보를 확인하고 수정 상태를 관리하는 모달입니다.
type DraftManualModalProps = {
  document: ManualDocument | null
  onClose: () => void
  onNotify: (message: string) => void
}

export default function DraftManualModal(props: DraftManualModalProps) {
  const { document } = props
  const [isEditing, setEditing] = useState(false)
  if (!document) return null
  return (
    <div
      role="presentation"
      onClick={props.onClose}
      className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-sm md:p-10"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="임시 저장 교범 상세 정보"
        onClick={(event) => event.stopPropagation()}
        className="my-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="min-w-0 flex-1 pr-6">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone="neutral">임시 저장</Badge>
              {isEditing && <Badge tone="blue">수정 중</Badge>}
            </div>
            <div
              role={isEditing ? "textbox" : undefined}
              contentEditable={isEditing}
              suppressContentEditableWarning
              className={`text-xl font-black outline-none ${
                isEditing
                  ? "rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus:border-slate-400"
                  : ""
              }`}
            >
              {document.name}
            </div>
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={props.onClose}
            onKeyDown={(event) => event.key === "Enter" && props.onClose()}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <Icon name="plus" className="size-5 rotate-45" />
          </div>
        </div>
        <div className="space-y-6 p-6">
          <section>
            <div className="mb-3 text-sm font-extrabold text-slate-900">
              기본 정보
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-400">
                  훈련 분야
                </div>
                <div
                  role={isEditing ? "textbox" : undefined}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  className={`mt-2 text-sm font-bold text-slate-700 outline-none ${
                    isEditing
                      ? "rounded border border-slate-200 bg-white px-2 py-1.5 focus:border-slate-400"
                      : ""
                  }`}
                >
                  {document.field}
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-400">
                  최근 수정
                </div>
                <div className="mt-2 text-sm font-bold text-slate-700">
                  {document.date}
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
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-400">
                  파일 형식
                </div>
                <div className="mt-2 text-sm font-bold text-slate-700">
                  {document.type}
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="mb-3 text-sm font-extrabold text-slate-900">
              교범 설명
            </div>
            <div
              role={isEditing ? "textbox" : undefined}
              contentEditable={isEditing}
              suppressContentEditableWarning
              className={`min-h-24 rounded-xl border px-4 py-3 text-sm leading-relaxed text-slate-600 outline-none ${
                isEditing
                  ? "border-slate-300 bg-white focus:border-slate-500"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              오염지역에서 분대원이 수행해야 하는 역할과 행동 절차, 정보 공유
              방법 및 금지 행동을 정리한 교육 지침입니다.
            </div>
          </section>
          <section>
            <div className="mb-3 text-sm font-extrabold text-slate-900">
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
              {isEditing && <Button variant="secondary">파일 교체</Button>}
            </div>
          </section>
        </div>
        <div className="flex items-center justify-end rounded-b-2xl border-t border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            {isEditing && (
              <Button variant="secondary" onClick={() => setEditing(false)}>
                취소
              </Button>
            )}
            <Button
              icon={isEditing ? "check" : undefined}
              onClick={() => {
                if (isEditing) {
                  props.onNotify(`${document.name} 수정 내용을 저장했습니다.`)
                  setEditing(false)
                } else {
                  setEditing(true)
                }
              }}
            >
              {isEditing ? "수정 저장" : "수정"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
