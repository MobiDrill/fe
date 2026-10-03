import { useEffect, useMemo, useRef, useState } from "react"
import AppShell from "@/components/layout/AppShell"
import Toast from "@/components/ui/Toast"
import ManualListPage from "@/features/manuals/pages/ManualListPage"
import ManualRegistrationPage from "@/features/manuals/pages/ManualRegistrationPage"
import ManualReviewPage from "@/features/manuals/pages/ManualReviewPage"
import ProblemPreviewPage from "@/features/manuals/pages/ProblemPreviewPage"
import ProblemReviewPage from "@/features/manuals/pages/ProblemReviewPage"
import type {
  ManualDocument,
  ReviewProgress,
} from "@/features/manuals/model/manual.types"
import type { PageMode } from "@/app/types"
import LoginPage from "@/features/auth/pages/LoginPage"
import SignupPage from "@/features/auth/pages/SignupPage"
import AuthLayout from "@/features/auth/components/AuthLayout"
import { useAuth } from "@/features/auth/context/AuthProvider"
import TrainingFieldsPage from "@/features/training-fields/pages/TrainingFieldsPage"
import useTrainingFields from "@/features/training-fields/model/trainingFields"
import { documents as originalDocuments } from "@/features/manuals/data/manuals.mock"

const getScreen = () => {
  if (window.location.hash === "#/signup") return "signup"
  if (window.location.hash === "#/manuals") return "manuals"
  if (window.location.hash === "#/training-fields") return "training-fields"
  return "login"
}

// 앱 레이아웃과 교범 관련 페이지 전환, 페이지 간 공유 상태를 조합하는 최상위 컴포넌트입니다.
export default function App() {
  const auth = useAuth()
  const [screen, setScreen] = useState(getScreen)
  const observedHash = useRef(window.location.hash)
  const [trainingEntryRevision, setTrainingEntryRevision] = useState(0)
  const training = useTrainingFields(
    auth.status === "authenticated" &&
      !auth.loggingOut &&
      (screen === "manuals" || screen === "training-fields"),
    auth.user?.userId,
    trainingEntryRevision,
  )
  const [registeredDocuments, setRegisteredDocuments] =
    useState<ManualDocument[]>([])
  const documents = useMemo(
    () => [
      ...registeredDocuments.map((document) => ({
        ...document,
        field:
          document.trainingFieldId === null
            ? "미지정"
            : (training.fields.find(
                (field) => field.trainingFieldId === document.trainingFieldId,
              )?.name ?? document.field),
      })),
      ...originalDocuments,
    ],
    [training.fields, registeredDocuments],
  )
  const fieldNames = [
    ...new Set([
      ...training.fields.map((field) => field.name),
      ...documents
        .filter((document) => document.trainingFieldId !== undefined)
        .map((document) => document.field),
    ]),
  ]
  const [signupEmail, setSignupEmail] = useState("")
  const [registered, setRegistered] = useState(false)
  const [activeNav, setActiveNav] = useState(() =>
    getScreen() === "training-fields" ? "훈련 분야 관리" : "교범 관리",
  )
  const [pageMode, setPageMode] = useState<PageMode>("list")
  const [activeDocument, setActiveDocument] = useState<ManualDocument | null>(
    null,
  )
  const [reviewProgress, setReviewProgress] =
    useState<Record<string, ReviewProgress>>({})
  const [problemReviewProgress, setProblemReviewProgress] =
    useState<Record<string, ReviewProgress>>({})
  const [notice, setNotice] = useState("")

  useEffect(() => {
    const updateScreen = (event: HashChangeEvent) => {
      const nextHash = new URL(event.newURL).hash
      // 이미 표시된 경로나 더 오래된 hashchange 이벤트는 재진입으로 처리하지 않습니다.
      if (
        nextHash !== window.location.hash ||
        nextHash === observedHash.current
      )
        return
      observedHash.current = nextHash
      const next = getScreen()
      setScreen(next)
      if (next === "manuals" || next === "training-fields")
        setTrainingEntryRevision((previous) => previous + 1)
      if (next === "training-fields") setActiveNav("훈련 분야 관리")
      if (next === "manuals") setActiveNav("교범 관리")
      setPageMode("list")
      setActiveDocument(null)
    }
    window.addEventListener("hashchange", updateScreen)
    return () => window.removeEventListener("hashchange", updateScreen)
  }, [])

  useEffect(() => {
    if (
      auth.status === "authenticated" &&
      screen !== "manuals" &&
      screen !== "training-fields"
    )
      window.location.hash = "/manuals"
    if (
      auth.status === "anonymous" &&
      (screen === "manuals" || screen === "training-fields")
    )
      window.location.hash = "/login"
  }, [auth.status, screen])

  useEffect(() => {
    if (auth.status !== "anonymous") return
    setActiveDocument(null)
    setPageMode("list")
    setActiveNav("교범 관리")
    setReviewProgress({})
    setProblemReviewProgress({})
    setNotice("")
    setRegisteredDocuments([])
  }, [auth.status])

  useEffect(() => {
    if (!notice) return
    const timeoutId = window.setTimeout(() => setNotice(""), 2400)
    return () => window.clearTimeout(timeoutId)
  }, [notice])

  const navigate = (mode: PageMode, document: ManualDocument | null = null) => {
    if (mode === "list" && pageMode !== "list" && activeNav === "교범 관리")
      setTrainingEntryRevision((previous) => previous + 1)
    setActiveDocument(document)
    setPageMode(mode)
  }

  const renderPage = () => {
    if (activeNav === "훈련 분야 관리") {
      return (
        <TrainingFieldsPage
          fields={training.fields}
          loading={training.loading}
          loadError={training.loadError}
          onReload={training.reload}
          onCreate={training.create}
          onUpdate={training.update}
          onDelete={async (id) => {
            await training.remove(id)
            setRegisteredDocuments((previous) =>
              previous.map((document) =>
                document.trainingFieldId === id
                  ? { ...document, trainingFieldId: null, field: "미지정" }
                  : document,
              ),
            )
          }}
          onNotify={setNotice}
        />
      )
    }
    if (pageMode === "register") {
      return (
        <ManualRegistrationPage
          trainingFields={training.fields}
          fieldsLoading={training.loading}
          fieldsError={training.loadError}
          onReloadFields={training.reload}
          onBack={() => navigate("list")}
          onSave={(manual) => {
            setRegisteredDocuments((previous) => [
              {
                name: manual.manualTitle,
                version: "—",
                type:
                  manual.file.originalName.split(".").pop()?.toUpperCase() ??
                  manual.file.fileType,
                field:
                  training.fields.find(
                    (field) => field.trainingFieldId === manual.trainingFieldId,
                  )?.name ?? `훈련 분야 ${manual.trainingFieldId}`,
                trainingFieldId: manual.trainingFieldId,
                state: "임시 저장",
                tone: "neutral",
                date: new Date().toLocaleString("ko-KR", {
                  timeZone: "Asia/Seoul",
                }),
              },
              ...previous,
            ])
            setNotice("교범이 등록되었습니다.")
            navigate("list")
          }}
        />
      )
    }

    if (pageMode === "review" && activeDocument) {
      const progress = reviewProgress[activeDocument.name]
      return (
        <ManualReviewPage
          document={activeDocument}
          initialCompleted={progress?.completed ?? 0}
          initialSection={progress?.current ?? 0}
          onBack={() => navigate("list")}
          onApprove={() => {
            setNotice(`${activeDocument.name} 검수를 승인했습니다.`)
            navigate("list")
          }}
          onProgress={(completed, total) =>
            setReviewProgress((previous) => ({
              ...previous,
              [activeDocument.name]: {
                completed: completed === total ? total : completed,
                current: previous[activeDocument.name]?.current ?? 0,
              },
            }))
          }
          onSaveDraft={(completed, current) => {
            setReviewProgress((previous) => ({
              ...previous,
              [activeDocument.name]: { completed, current },
            }))
            setNotice("임시 저장 되었습니다.")
          }}
        />
      )
    }

    if (pageMode === "problem-preview" && activeDocument) {
      return (
        <ProblemPreviewPage
          document={activeDocument}
          onBack={() => navigate("list")}
          onStartReview={() => setPageMode("problem-review")}
        />
      )
    }

    if (pageMode === "problem-review" && activeDocument) {
      const progress = problemReviewProgress[activeDocument.name]
      return (
        <ProblemReviewPage
          document={activeDocument}
          initialCompleted={progress?.completed ?? 0}
          initialSection={progress?.current ?? 0}
          onBack={() => navigate("list")}
          onApprove={() => {
            setNotice(`${activeDocument.name} 문제 검수를 완료했습니다.`)
            navigate("list")
          }}
          onSaveDraft={(completed, current) => {
            setProblemReviewProgress((previous) => ({
              ...previous,
              [activeDocument.name]: { completed, current },
            }))
            setNotice("임시 저장 되었습니다.")
          }}
        />
      )
    }

    return (
      <>
        {training.loading && (
          <p
            role="status"
            className="mx-auto max-w-screen-2xl px-5 pt-5 text-sm text-slate-500 md:px-8"
          >
            훈련 분야를 불러오고 있습니다…
          </p>
        )}
        {training.loadError && (
          <div className="mx-auto flex max-w-screen-2xl items-center gap-3 px-5 pt-5 md:px-8">
            <p role="alert" className="text-sm text-rose-600">
              {training.loadError}
            </p>
            <button
              type="button"
              onClick={training.reload}
              className="text-sm font-bold"
            >
              다시 시도
            </button>
          </div>
        )}
        <ManualListPage
          documents={documents}
          trainingFields={fieldNames}
          reviewProgress={reviewProgress}
          problemReviewProgress={problemReviewProgress}
          onRegister={() => navigate("register")}
          onOpenReview={(document) => navigate("review", document)}
          onOpenProblemPreview={(document) =>
            navigate("problem-preview", document)
          }
          onOpenProblemReview={(document) =>
            navigate("problem-review", document)
          }
          onNotify={setNotice}
        />
      </>
    )
  }

  if (auth.status === "initializing") {
    return (
      <AuthLayout>
        <h2 className="text-xl font-extrabold">로그인 상태 확인</h2>
        {auth.restoreError ? (
          <>
            <p role="alert" className="mt-4 text-sm leading-6 text-rose-600">
              {auth.restoreError}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  void auth.restoreSession()
                }}
                className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-bold text-white"
              >
                다시 시도
              </button>
              <button
                type="button"
                onClick={() => auth.discardSession()}
                className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold"
              >
                로그인 화면으로
              </button>
            </div>
          </>
        ) : (
          <p role="status" className="mt-4 text-sm text-slate-500">
            세션을 확인하고 있습니다…
          </p>
        )}
      </AuthLayout>
    )
  }

  if (auth.status === "anonymous" && screen === "signup") {
    return (
      <SignupPage
        onSignup={(email) => {
          setSignupEmail(email)
          setRegistered(true)
          window.location.hash = "/login"
        }}
      />
    )
  }

  if (auth.status === "anonymous") {
    return (
      <LoginPage
        email={signupEmail}
        registered={registered}
        message={auth.message}
        onLogin={() => {
          setRegistered(false)
          navigate("list")
          setNotice("로그인되었습니다.")
          window.location.hash = "/manuals"
        }}
      />
    )
  }

  return (
    <AppShell
      userName={auth.user?.name ?? "사용자"}
      loggingOut={auth.loggingOut}
      onLogout={() => {
        void auth.logout()
      }}
      activeNav={activeNav}
      onNavigate={(label) => {
        setActiveNav(label)
        setPageMode("list")
        setActiveDocument(null)
        const targetHash =
          label === "훈련 분야 관리" ? "#/training-fields" : "#/manuals"
        if (window.location.hash === targetHash)
          setTrainingEntryRevision((previous) => previous + 1)
        else window.location.hash = targetHash
      }}
    >
      {renderPage()}
      <Toast message={notice} />
    </AppShell>
  )
}
