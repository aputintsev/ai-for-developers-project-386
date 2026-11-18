import { useState } from 'react'
import BookingAvailability from './BookingAvailability'
import CreateMeetingTypeForm from './CreateMeetingTypeForm'
import { listMeetingTypes } from './api/generated/sdk.gen'
import { useRemoteList } from './lib/use-remote-list'

function MeetingTypeList({ allowCreation = false }: { allowCreation?: boolean }) {
  const [selectedId, setSelectedId] = useState<string>()
  const [submitting, setSubmitting] = useState(false)
  const [meetingTypes, setMeetingTypes] = useRemoteList(listMeetingTypes)

  if (meetingTypes === 'loading') {
    return <p className="mt-6 text-muted-foreground" role="status">Загружаем типы встреч…</p>
  }
  if (meetingTypes === 'error') {
    return <p className="mt-6" role="alert">Не удалось загрузить типы встреч.</p>
  }
  const selectedType = meetingTypes.find(({ id }) => id === selectedId)

  return (
    <>
      {meetingTypes.length === 0 ? (
        <p className="mt-6 text-muted-foreground">Типов встреч пока нет.</p>
      ) : (
        <ul className="mt-6 grid gap-3">
          {meetingTypes.map((meetingType) => (
            <li key={meetingType.id} className="rounded-lg border p-4">
              <h2 className="font-semibold">
                {allowCreation ? meetingType.name : (
                  <button
                    type="button"
                    aria-pressed={selectedId === meetingType.id}
                    disabled={submitting}
                    onClick={() => setSelectedId(meetingType.id)}
                    className="min-h-11 cursor-pointer rounded-sm text-left underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {meetingType.name}
                  </button>
                )}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{meetingType.description}</p>
              <p className="mt-2 text-sm">{meetingType.durationMinutes} мин</p>
            </li>
          ))}
        </ul>
      )}
      {selectedType && (
        <BookingAvailability
          key={selectedType.id}
          meetingType={selectedType}
          submitting={submitting}
          setSubmitting={setSubmitting}
        />
      )}
      {allowCreation && (
        <CreateMeetingTypeForm onCreated={(created) => {
          setMeetingTypes((current) => Array.isArray(current) ? [...current, created] : [created])
        }} />
      )}
    </>
  )
}

export default MeetingTypeList
