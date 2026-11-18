import type { IncomingMessage, ServerResponse } from 'node:http'
import type { CreateMeetingType400FieldErrors } from '../src/api/generated/models/createMeetingType400FieldErrors.ts'
import type { MeetingType } from '../src/api/generated/models/meetingType.ts'
import { createMeetingTypeStore } from './meeting-types.ts'

function sendJson(response: ServerResponse, status: number, body: unknown) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(body))
}

export function createCalendarApi(initialMeetingTypes: readonly MeetingType[] = []) {
  const meetingTypes = createMeetingTypeStore(initialMeetingTypes)

  async function createMeetingType(request: IncomingMessage, response: ServerResponse) {
    const chunks: Buffer[] = []
    for await (const chunk of request) chunks.push(chunk)
    const input: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    const fields = input && typeof input === 'object' ? input : {}
    const name = 'name' in fields && typeof fields.name === 'string' ? fields.name.trim() : ''
    const description = 'description' in fields && typeof fields.description === 'string' ? fields.description.trim() : ''
    const durationMinutes = 'durationMinutes' in fields ? fields.durationMinutes : undefined

    const fieldErrors: CreateMeetingType400FieldErrors = {}
    if (!name) fieldErrors.name = 'Введите название.'
    if (!description) fieldErrors.description = 'Введите описание.'
    const validDuration = typeof durationMinutes === 'number'
      && Number.isInteger(durationMinutes) && durationMinutes >= 1 && durationMinutes <= 480
    if (!validDuration) fieldErrors.durationMinutes = 'Введите целое число от 1 до 480.'
    if (!name || !description || !validDuration) {
      sendJson(response, 400, { message: 'Проверьте поля формы.', fieldErrors })
      return
    }

    const created = meetingTypes.create({ name, description, durationMinutes })
    if (!created) {
      const message = 'Тип встречи с таким названием уже существует.'
      sendJson(response, 409, { message, fieldErrors: { name: message } })
      return
    }
    sendJson(response, 201, created)
  }

  return function handleCalendarApi(request: IncomingMessage, response: ServerResponse) {
    const pathname = new URL(request.url ?? '/', 'http://localhost').pathname
    if (pathname !== '/api/meeting-types') return false

    if (request.method === 'GET') {
      sendJson(response, 200, meetingTypes.list())
      return true
    }
    if (request.method === 'POST') {
      void createMeetingType(request, response).catch(() => {
        sendJson(response, 400, { message: 'Не удалось прочитать данные.', fieldErrors: {} })
      })
      return true
    }
    return false
  }
}
