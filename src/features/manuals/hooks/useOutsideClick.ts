import { useEffect, type RefObject } from "react"

// 지정한 요소 바깥을 클릭했을 때 드롭다운이나 팝오버를 닫도록 처리합니다.
export default function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutsideClick: () => void,
) {
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node))
        onOutsideClick()
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [onOutsideClick, ref])
}
