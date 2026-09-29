import type { ReactNode } from "react"
import AppSidebar from "@/components/layout/AppSidebar"

// 사이드바와 현재 페이지 콘텐츠를 조합하는 애플리케이션 공통 레이아웃입니다.
type AppShellProps = {
  activeNav: string
  onNavigate: (label: string) => void
  children: ReactNode
}

export default function AppShell({
  activeNav,
  onNavigate,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <AppSidebar activeNav={activeNav} onNavigate={onNavigate} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
