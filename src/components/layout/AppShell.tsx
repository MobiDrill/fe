import type { ReactNode } from "react"
import AppSidebar from "@/components/layout/AppSidebar"

// 사이드바와 현재 페이지 콘텐츠를 조합하는 애플리케이션 공통 레이아웃입니다.
type AppShellProps = {
  activeNav: string
  onNavigate: (label: string) => void
  onLogout: () => void
  userName: string
  loggingOut: boolean
  children: ReactNode
}

export default function AppShell({
  activeNav,
  onNavigate,
  onLogout,
  userName,
  loggingOut,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <AppSidebar
          activeNav={activeNav}
          onNavigate={onNavigate}
          userName={userName}
        />
        <main className="min-w-0 flex-1">
          <div className="flex items-center justify-end gap-3 border-b border-slate-200 bg-white px-5 py-3 md:px-8">
            <span className="text-xs text-slate-500">{userName}</span>
            <button
              type="button"
              onClick={onLogout}
              disabled={loggingOut}
              aria-busy={loggingOut}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-slate-900"
            >
              {loggingOut ? "로그아웃 중…" : "로그아웃"}
            </button>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
