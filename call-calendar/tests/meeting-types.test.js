import { afterEach, expect, test, vi } from 'vitest'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { listMeetingTypes } from '../src/api/generated/sdk.gen'
import { createCalendarConfig } from '../vite.config'

const meetingType = {
  id: 'intro',
  name: 'Знакомство',
  description: 'Обсудим ваши цели',
  durationMinutes: 30,
}

let server

async function startCalendar(initialMeetingTypes) {
  server = await createServer({
    ...createCalendarConfig(initialMeetingTypes),
    configFile: false,
    server: { host: '127.0.0.1', port: 0, open: false },
  })
  await server.listen()
  return `http://127.0.0.1:${server.httpServer.address().port}`
}

afterEach(async () => {
  vi.unstubAllGlobals()
  await server?.close()
})

test('the meeting types API returns an empty list for a new calendar', async () => {
  const baseUrl = await startCalendar()
  vi.stubGlobal('location', { origin: baseUrl })
  const { data, status } = await listMeetingTypes()
  expect(status).toBe(200)
  expect(data).toEqual([])
})

test('the meeting types API returns the available meeting types', async () => {
  const baseUrl = await startCalendar([meetingType])
  vi.stubGlobal('location', { origin: baseUrl })
  const { data, status } = await listMeetingTypes()
  expect(status).toBe(200)
  expect(data).toEqual([{
    id: 'intro',
    name: 'Знакомство',
    description: 'Обсудим ваши цели',
    durationMinutes: 30,
  }])
})

test('a Guest can find an available meeting type after choosing to book', async () => {
  const baseUrl = await startCalendar([meetingType])
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHROMIUM_CHANNEL })
  try {
    const page = await browser.newPage()
    await page.goto(baseUrl)
    await page.getByRole('link', { name: 'Записаться', exact: true }).click()
    await page.getByRole('heading', { name: 'Выбор типа встречи' }).waitFor()
    await page.getByText('Знакомство', { exact: true }).waitFor({ timeout: 3_000 })
    await page.getByText('Обсудим ваши цели', { exact: true }).waitFor()
    await page.getByText('30 мин', { exact: true }).waitFor()
  } finally {
    await browser.close()
  }
}, 30_000)
