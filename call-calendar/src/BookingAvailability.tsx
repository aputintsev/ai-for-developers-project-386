import { useEffect, useState } from 'react'
import { listSlots } from './api/generated/sdk.gen'
import type { Slot } from './api/generated/models/slot'
import { bookingWindow, calendarTimeZone, moscowTime } from './lib/calendar-time'

function AvailableSlots({ meetingTypeId, date }: { meetingTypeId: string; date: string }) {
  const [result, setResult] = useState<Slot[] | 'loading' | string>('loading')

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const { data, status } = await listSlots(meetingTypeId, { date }, { signal: controller.signal })
        if (!controller.signal.aborted) setResult(status === 200 ? data.slots : data.message)
      } catch {
        if (!controller.signal.aborted) setResult('Не удалось загрузить свободные слоты.')
      }
    }

    void load()
    return () => controller.abort()
  }, [meetingTypeId, date])

  if (result === 'loading') return <p role="status">Загружаем свободные слоты…</p>
  if (typeof result === 'string') return <p role="alert">{result}</p>
  if (!result.length) return <p role="status">На эту дату нет свободных слотов.</p>

  return (
    <ul aria-label="Свободные слоты" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {result.map(({ start, end }) => (
        <li key={start} className="rounded-md border px-2 py-2 text-center text-sm">
          {moscowTime(start)}–{moscowTime(end)}
        </li>
      ))}
    </ul>
  )
}

export default function BookingAvailability({ meetingTypeId }: { meetingTypeId: string }) {
  const [date, setDate] = useState('')
  const { first, last } = bookingWindow(new Date())

  return (
    <section className="mt-6 grid gap-3 border-t pt-6">
      <label className="grid w-fit gap-2 text-sm font-medium">
        Дата встречи
        <input
          type="date"
          className="min-h-11 rounded-md border bg-background px-3"
          min={first}
          max={last}
          value={date}
          onChange={(event) => setDate(event.currentTarget.value)}
        />
      </label>
      <p className="text-sm text-muted-foreground">Время по Москве ({calendarTimeZone})</p>
      {date && <AvailableSlots key={date} meetingTypeId={meetingTypeId} date={date} />}
    </section>
  )
}
