import { useEffect, useState } from "react"
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

// 앱 레이아웃과 교범 관련 페이지 전환, 페이지 간 공유 상태를 조합하는 최상위 컴포넌트입니다.
export default function App() {
  const [activeNav, setActiveNav] = useState("교범 관리")
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
    if (!notice) return
    const timeoutId = window.setTimeout(() => setNotice(""), 2400)
    return () => window.clearTimeout(timeoutId)
  }, [notice])

  const navigate = (mode: PageMode, document: ManualDocument | null = null) => {
    setActiveDocument(document)
    setPageMode(mode)
  }

  const renderPage = () => {
    if (pageMode === "register") {
      return (
        <ManualRegistrationPage
          onBack={() => navigate("list")}
          onSave={() => {
            setNotice("교범을 임시 저장했습니다.")
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
      <ManualListPage
        reviewProgress={reviewProgress}
        problemReviewProgress={problemReviewProgress}
        onRegister={() => navigate("register")}
        onOpenReview={(document) => navigate("review", document)}
        onOpenProblemPreview={(document) =>
          navigate("problem-preview", document)
        }
        onOpenProblemReview={(document) => navigate("problem-review", document)}
        onNotify={setNotice}
      />
    )
  }

  return (
    <AppShell
      activeNav={activeNav}
      onNavigate={(label) => {
        setActiveNav(label)
        navigate("list")
      }}
    >
      {renderPage()}
      <Toast message={notice} />
    </AppShell>
  )
}
