import { useRef, useState, type FormEvent } from "react"
import { useAuth } from "@/features/auth/context/AuthProvider"
import { validateLogin } from "@/features/auth/model/auth.validation"
import { errorMessage } from "@/lib/api/http"
import AuthLayout from "@/features/auth/components/AuthLayout"
import PasswordInput from "@/features/auth/components/PasswordInput"
import Icon from "@/components/ui/Icon"

export default function LoginPage({
  email,
  registered,
  onLogin,
  message,
}: {
  email: string
  registered: boolean
  onLogin: () => void
  message: string
}) {
  const auth = useAuth()
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const busy = useRef(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy.current) return
    const data = new FormData(event.currentTarget)
    const input = {
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
    }
    const validation = validateLogin(input)
    if (validation) {
      setError(validation)
      return
    }
    busy.current = true
    setPending(true)
    setError("")
    try {
      await auth.login(input)
      onLogin()
    } catch (error) {
      setError(errorMessage(error))
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  return (
    <AuthLayout>
      <h2 className="text-2xl font-black tracking-tight">로그인</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        계정 정보를 입력해 주세요.
      </p>
      {registered && (
        <p
          role="status"
          className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-700"
        >
          회원가입이 완료되었습니다. 가입한 계정으로 로그인해 주세요.
        </p>
      )}
      {message && (
        <p
          role="status"
          className="mt-5 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600"
        >
          {message}
        </p>
      )}
      <form onSubmit={submit} aria-busy={pending} className="mt-7">
        <fieldset disabled={pending} className="space-y-5">
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
              defaultValue={email}
              required
              maxLength={255}
              placeholder="이메일을 입력해 주세요"
              className="h-12 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
            />
          </div>
          <PasswordInput
            id="password"
            label="비밀번호"
            autoComplete="current-password"
          />
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm leading-5 text-rose-600"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            {pending ? "로그인 중…" : "로그인"}
            <Icon name="arrow" className="size-4" />
          </button>
        </fieldset>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        아직 계정이 없으신가요?{" "}
        <a
          href="#/signup"
          className="ml-1 rounded font-bold text-slate-900 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-slate-900"
        >
          회원가입
        </a>
      </p>
    </AuthLayout>
  )
}
