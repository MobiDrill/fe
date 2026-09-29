import Icon from "@/components/ui/Icon"

// 사용자 작업 결과를 화면 하단에 잠시 표시하는 전역 알림 UI입니다.
type ToastProps = { message: string }

export default function Toast({ message }: ToastProps) {
  if (!message) return null
  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
      <Icon name="check" className="size-4 text-emerald-400" />
      {message}
    </div>
  )
}
