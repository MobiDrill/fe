import { useState } from "react"

// 비밀번호 표시 전환과 브라우저 자동 완성을 지원하는 공통 입력창입니다.
export default function PasswordInput({
  id,
  label,
  autoComplete,
  minLength,
  maxLength,
  hint,
}: {
  id: string
  label: string
  autoComplete: "current-password" | "new-password"
  minLength?: number
  maxLength?: number
  hint?: string
}) {
  const [visible, setVisible] = useState(false)
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-slate-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          maxLength={maxLength}
          aria-describedby={hint ? `${id}-hint` : undefined}
          placeholder={
            label === "비밀번호 확인"
              ? "비밀번호를 다시 입력해 주세요"
              : "비밀번호를 입력해 주세요"
          }
          className="h-12 w-full rounded-lg border border-slate-200 pl-4 pr-16 text-sm outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
        />
        <button
          type="button"
          aria-label={`${label} ${visible ? "숨기기" : "보기"}`}
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
          className="absolute inset-y-1 right-1 rounded-md px-3 text-xs font-semibold text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-slate-900"
        >
          {visible ? "숨김" : "보기"}
        </button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-slate-400">
          {hint}
        </p>
      )}
    </div>
  )
}
