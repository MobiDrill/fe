import type { ReactNode } from "react"

export type BadgeTone = "neutral" | "green" | "amber" | "blue" | "red" | "purple" | "teal"

// 문서 처리 상태를 색상별 배지로 표시하는 공통 UI입니다.
export default function Badge({
  children,
  tone = "neutral",
  plain = false,
}: {
  children: ReactNode
  tone?: BadgeTone
  plain?: boolean
}) {
  const tones = {
    neutral: "bg-slate-100 text-slate-600",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    red: "bg-rose-50 text-rose-700",
    purple: "bg-violet-50 text-violet-700",
    teal: "bg-teal-50 text-teal-700",
  }
  const plainTones = {
    neutral: "text-slate-600",
    green: "text-emerald-700",
    amber: "text-amber-700",
    blue: "text-blue-700",
    red: "text-rose-700",
    purple: "text-violet-700",
    teal: "text-teal-700",
  }
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold ${
        plain ? plainTones[tone] : `rounded-md px-2.5 py-1 ${tones[tone]}`
      }`}
    >
      {children}
    </span>
  )
}
