import type { ReactNode } from "react"
import Icon, { type IconName } from "@/components/ui/Icon"

// 공통 버튼의 모양, 아이콘, 클릭 동작을 일관되게 제공합니다.
export default function Button({
  children,
  variant = "primary",
  icon,
  onClick,
}: {
  children: ReactNode
  variant?: "primary" | "secondary" | "ghost"
  icon?: IconName
  onClick?: () => void
}) {
  const styles = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
    secondary:
      "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
  }
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => event.key === "Enter" && onClick?.()}
      className={`inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${styles[variant]}`}
    >
      {icon && <Icon name={icon} className="size-4" />}
      {children}
    </div>
  )
}
