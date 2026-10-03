import { useState } from "react"
import Icon from "@/components/ui/Icon"
import { navigation } from "@/app/navigation"

// 전체 화면에서 공통으로 사용하는 관리자 사이드바와 접기 동작을 담당합니다.
type AppSidebarProps = {
  activeNav: string
  onNavigate: (label: string) => void
  userName: string
}

export default function AppSidebar({
  activeNav,
  onNavigate,
  userName,
}: AppSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <aside
      className={`hidden shrink-0 border-r border-slate-200 bg-white transition-all duration-200 lg:flex lg:flex-col ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div
        className={`flex h-20 items-center border-b border-slate-100 ${
          isOpen ? "gap-3 px-6" : "justify-center px-3"
        }`}
      >
        {isOpen ? (
          <>
            <div className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Icon name="soldier" />
            </div>
            <div className="min-w-0 flex-1 text-base font-extrabold tracking-tight">
              MobiDrill
            </div>
            <button
              type="button"
              aria-label="사이드바 접기"
              onClick={() => setIsOpen(false)}
              className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <Icon name="chevron" className="size-4 rotate-180" />
            </button>
          </>
        ) : (
          <button
            type="button"
            aria-label="사이드바 펼치기"
            onClick={() => setIsOpen(true)}
            className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-white"
          >
            <Icon name="soldier" />
          </button>
        )}
      </div>
      <div className="flex-1 px-2 py-6">
        {isOpen && (
          <div className="mb-3 px-3 text-xs font-bold tracking-widest text-slate-400">
            관리 메뉴
          </div>
        )}
        <div className="space-y-1">
          {navigation.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate(item.label)}
              className={`group flex w-full items-center rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
                isOpen ? "gap-3" : "justify-center"
              } ${
                activeNav === item.label
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <Icon name={item.icon} className="size-5 shrink-0" />
              {isOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count && (
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs ${
                        activeNav === item.label
                          ? "bg-white/15 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
        {isOpen && (
          <div className="mb-3 mt-8 px-3 text-xs font-bold tracking-widest text-slate-400">
            시스템
          </div>
        )}
        <div
          className={`flex items-center rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 ${
            isOpen ? "gap-3" : "mt-8 justify-center"
          }`}
          title={!isOpen ? "환경 설정" : undefined}
        >
          <Icon name="settings" className="size-5 shrink-0" />
          {isOpen && <span>환경 설정</span>}
        </div>
      </div>
      <div
        className={`flex items-center border-t border-slate-100 p-4 ${
          isOpen ? "gap-3" : "justify-center"
        }`}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-extrabold text-slate-700">
          {userName.slice(0, 1)}
        </div>
        {isOpen && (
          <>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold">{userName}</div>
              <div className="truncate text-xs text-slate-400">
                교육훈련 사용자
              </div>
            </div>
            <Icon name="more" className="size-5 text-slate-400" />
          </>
        )}
      </div>
    </aside>
  )
}
