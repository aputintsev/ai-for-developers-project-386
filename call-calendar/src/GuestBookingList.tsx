import { useEffect, useState } from 'react'
import type { GuestBooking } from './api/generated/models/guestBooking'
import { listGuestBookings } from './api/generated/sdk.gen'
import { buttonVariants } from './components/ui/button'
import { calendarTimeZone, moscowDate, moscowTime } from './lib/calendar-time'

function GuestBookingList({ bookingPath }: { bookingPath: string }) {
  const [bookings, setBookings] = useState<GuestBooking[] | 'loading' | 'error'>('loading')

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const { data, status } = await listGuestBookings({ signal: controller.signal })
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

  if (bookings === 'loading') {
    return <p className="mt-6 text-muted-foreground" role="status">Загружаем записи…</p>
  }

  if (bookings === 'error') {
    return <p className="mt-6" role="alert">Не удалось загрузить записи.</p>
  }

  if (bookings.length === 0) {
    return (
      <div className="mt-6 grid gap-3">
        <p className="text-muted-foreground">У вас нет предстоящих записей</p>
        <a href={bookingPath} className={buttonVariants({ className: 'min-h-11 w-fit' })}>Записаться</a>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <p className="text-sm text-muted-foreground">Время по Москве ({calendarTimeZone})</p>
      <ul className="mt-3 grid gap-3">
        {bookings.map(({ id, meetingType, start, end }) => {
          const date = moscowDate(new Date(start))
          return (
            <li key={id} className="grid gap-1 rounded-lg border p-4 text-sm">
              <h2 className="text-base font-semibold">{meetingType.name}</h2>
              <time dateTime={date}>{date.split('-').reverse().join('.')}</time>
              <p>{moscowTime(start)}–{moscowTime(end)}</p>
              <p>{meetingType.durationMinutes} мин</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default GuestBookingList
