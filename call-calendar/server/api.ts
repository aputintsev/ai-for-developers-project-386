import type { IncomingMessage, ServerResponse } from 'node:http'
import type { MeetingType } from '../src/api/generated/models/meetingType.ts'

export function createCalendarApi(initialMeetingTypes: readonly MeetingType[] = []) {
  const meetingTypes = [...initialMeetingTypes]

  return function handleCalendarApi(request: IncomingMessage, response: ServerResponse) {
    const pathname = new URL(request.url ?? '/', 'http://localhost').pathname
    if (request.method !== 'GET' || pathname !== '/api/meeting-types') return false

    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify(meetingTypes))
    return true
  }
}
