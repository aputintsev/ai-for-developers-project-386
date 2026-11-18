import { useEffect, useState } from 'react'
import type { Booking } from './api/generated/models/booking'
import { listOwnerBookings } from './api/generated/sdk.gen'
import { calendarTimeZone, moscowDate, moscowTime } from './lib/calendar-time'

function OwnerBookingList() {
  const [bookings, setBookings] = useState<Booking[] | 'loading' | 'error'>('loading')

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const { data, status } = await listOwnerBookings({ signal: controller.signal })
        if (!controller.signal.aborted) {
          setBookings(status === 200 && Array.isArray(data) ? data : 'error')
        }
      } catch {
        if (!controller.signal.aborted) setBookings('error')
      }
    }

    void load()
    return () => controller.abort()
  }, [])

  return (
    <section aria-labelledby="owner-bookings" className="mt-8">
      <h2 id="owner-bookings" className="text-xl font-semibold">Предстоящие записи</h2>
      {bookings === 'loading' && <p className="mt-3 text-muted-foreground" role="status">Загружаем записи…</p>}
      {bookings === 'error' && <p className="mt-3" role="alert">Не удалось загрузить записи.</p>}
      {Array.isArray(bookings) && (bookings.length === 0 ? (
        <p className="mt-3 text-muted-foreground">Нет предстоящих записей</p>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted-foreground">Время по Москве ({calendarTimeZone})</p>
          <ul className="mt-3 grid gap-3">
            {bookings.map(({ id, meetingType, start, end, guestName, guestEmail }) => {
              const date = moscowDate(new Date(start))
              return (
                <li key={id} className="grid gap-1 rounded-lg border p-4 text-sm">
                  <h3 className="text-base font-semibold">{meetingType.name}</h3>
                  <time dateTime={date}>{date.split('-').reverse().join('.')}</time>
                  <p>{moscowTime(start)}–{moscowTime(end)}</p>
                  <p>{meetingType.durationMinutes} мин</p>
                  <p className="mt-1 wrap-anywhere">{guestName}</p>
                  <p className="wrap-anywhere">{guestEmail}</p>
                </li>
              )
            })}
          </ul>
        </>
      ))}
    </section>
  )
}

export default OwnerBookingList
