import { useCallback, useEffect, useRef, useState } from "react"
import * as api from "../api/trainingFields.api"
import { errorMessage } from "@/lib/api/http"
export type {
  TrainingField,
  TrainingFieldInput,
} from "../api/trainingFields.api"

export default function useTrainingFields(
  enabled: boolean,
  owner?: number,
  entryRevision = 0,
) {
  const [fields, setFields] = useState<api.TrainingField[]>([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState("")
  const [revision, setRevision] = useState(0)
  const epoch = useRef(0)
  const reload = useCallback(() => setRevision((value) => value + 1), [])

  useEffect(() => {
    const ticket = ++epoch.current
    const controller = new AbortController()
    setFields([])
    setLoadError("")
    setLoading(enabled)
    if (enabled) {
      void api
        .getAllTrainingFields(controller.signal)
        .then((result) => {
          if (epoch.current === ticket) setFields(result)
        })
        .catch((error) => {
          if (epoch.current === ticket) setLoadError(errorMessage(error))
        })
        .finally(() => {
          if (epoch.current === ticket) setLoading(false)
        })
    }
    return () => {
      ++epoch.current
      controller.abort()
    }
  }, [enabled, owner, revision, entryRevision])

  const create = async (input: api.TrainingFieldInput) => {
    const ticket = epoch.current
    const result = await api.createTrainingField(input)
    if (ticket !== epoch.current) throw new Error("종료된 요청입니다.")
    setFields((previous) =>
      [result, ...previous].sort(
        (a, b) => b.trainingFieldId - a.trainingFieldId,
      ),
    )
  }
  const update = async (id: number, input: api.TrainingFieldInput) => {
    const ticket = epoch.current
    const result = await api.updateTrainingField(id, input)
    if (ticket !== epoch.current) throw new Error("종료된 요청입니다.")
    setFields((previous) =>
      previous.map((field) => (field.trainingFieldId === id ? result : field)),
    )
  }
  const remove = async (id: number) => {
    const ticket = epoch.current
    await api.deleteTrainingField(id)
    if (ticket !== epoch.current) throw new Error("종료된 요청입니다.")
    setFields((previous) =>
      previous.filter((field) => field.trainingFieldId !== id),
    )
  }
  return { fields, loading, loadError, reload, create, update, remove }
}
