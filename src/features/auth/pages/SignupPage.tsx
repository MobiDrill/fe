import { useRef, useState, type FormEvent } from "react"
import { useAuth } from "@/features/auth/context/AuthProvider"
import { validateSignup } from "@/features/auth/model/auth.validation"
import { errorMessage } from "@/lib/api/http"
import AuthLayout from "@/features/auth/components/AuthLayout"
import PasswordInput from "@/features/auth/components/PasswordInput"
import Icon from "@/components/ui/Icon"

export default function SignupPage({
  onSignup,
}: {
  onSignup: (email: string) => void
}) {
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const busy = useRef(false)
  const auth = useAuth()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy.current) return
    const form = event.currentTarget
    const data = new FormData(form)
    const input = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
      passwordConfirm: String(data.get("password-confirm") ?? ""),
    }
    const validation = validateSignup(input)
    if (validation) {
      setError(validation)
      form.querySelector<HTMLInputElement>("#password-confirm")?.focus()
      return
    }
    busy.current = true
    setPending(true)
    setError("")
    try {
      await auth.register(input)
      onSignup(input.email)
    } catch (error) {
      setError(errorMessage(error))
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  return (
    <AuthLayout>
      <h2 className="text-2xl font-black tracking-tight">회원가입</h2>
      <p className="mt-2 text-sm text-slate-500">
        회원가입에 필요한 계정 정보를 입력해 주세요.
      </p>
      <form
        onSubmit={submit}
        onChange={() => setError("")}
        aria-busy={pending}
        className="mt-7"
      >
        <fieldset disabled={pending} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              이름
            </label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              required
              maxLength={30}
              placeholder="이름을 입력해 주세요"
              className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-slate-700"
            >
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={255}
              placeholder="이메일을 입력해 주세요"
              className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
            />
          </div>
          <PasswordInput
            id="password"
            label="비밀번호"
            autoComplete="new-password"
            minLength={8}
            maxLength={64}
            hint="8~64자, UTF-8 기준 72바이트 이하로 입력해 주세요."
          />
          <PasswordInput
            id="password-confirm"
            label="비밀번호 확인"
            autoComplete="new-password"
            minLength={8}
            maxLength={64}
          />
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm leading-5 text-rose-600"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            {pending ? "가입 처리 중…" : "회원가입"}
            <Icon name="arrow" className="size-4" />
          </button>
        </fieldset>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        이미 계정이 있으신가요?{" "}
        <a
          href="#/login"
          className="ml-1 rounded font-bold text-slate-900 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-slate-900"
        >
          로그인
        </a>
      </p>
    </AuthLayout>
  )
}
