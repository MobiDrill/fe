import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import * as session from "@/features/auth/model/auth.session"
import { registerEmail } from "@/features/auth/api/auth.api"

const AuthContext = createContext<ReturnType<typeof useAuthValue> | null>(null)
function useAuthValue() {
  const state = useSyncExternalStore(session.subscribe, session.getSnapshot)
  return {
    ...state,
    login: session.login,
    register: registerEmail,
    logout: session.logout,
    restoreSession: session.restoreSession,
    discardSession: session.clearSession,
  }
}
export default function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuthValue()
  useEffect(() => {
    void session.restoreSession()
  }, [])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("AuthProvider가 필요합니다.")
  return context
}
