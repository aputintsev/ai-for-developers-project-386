import { useEffect, useState } from 'react'
import { listMeetingTypes } from './api/generated/sdk.gen'
import type { MeetingType } from './api/generated/models/meetingType'

function MeetingTypeList() {
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[] | 'loading' | 'error'>('loading')

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const { data, status } = await listMeetingTypes({ signal: controller.signal })
        if (!controller.signal.aborted) {
          setMeetingTypes(status === 200 && Array.isArray(data) ? data : 'error')
        }
      } catch {
        if (!controller.signal.aborted) setMeetingTypes('error')
      }
    }

    void load()
    return () => controller.abort()
  }, [])

  if (meetingTypes === 'loading') {
    return <p className="mt-6 text-muted-foreground" role="status">Загружаем типы встреч…</p>
  }
  if (meetingTypes === 'error') {
    return <p className="mt-6" role="alert">Не удалось загрузить типы встреч.</p>
  }
  if (meetingTypes.length === 0) {
    return <p className="mt-6 text-muted-foreground">Типов встреч пока нет.</p>
  }

  return (
    <ul className="mt-6 grid gap-3">
      {meetingTypes.map((meetingType) => (
        <li key={meetingType.id} className="rounded-lg border p-4">
          <h2 className="font-semibold">{meetingType.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{meetingType.description}</p>
          <p className="mt-2 text-sm">{meetingType.durationMinutes} мин</p>
        </li>
      ))}
    </ul>
  )
}

export default MeetingTypeList
