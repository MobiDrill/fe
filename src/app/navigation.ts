import type { IconName } from "@/components/ui/Icon"

// 앱 사이드바에 표시할 메뉴 이름, 아이콘, 카운트를 정의합니다.
export const navigation: {
  label: string
  icon: IconName
  count?: number
}[] = [
  { label: "훈련 분야 관리", icon: "grid" },
  { label: "교범 관리", icon: "book", count: 12 },
  { label: "문제 관리", icon: "grid" },
  { label: "훈련 세션", icon: "users" },
  { label: "평가 · AAR", icon: "chart" },
]
