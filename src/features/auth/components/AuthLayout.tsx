import type { ReactNode } from "react"

// 인증 입력 카드와 서비스명만 표시하는 공통 레이아웃입니다.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 text-slate-950 sm:px-8">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center">
          <a
            href="#/login"
            className="rounded-lg text-2xl font-extrabold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
          >
            MobiDrill
          </a>
        </div>
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40 sm:p-8">
          {children}
        </section>
      </div>
    </main>
  )
}
