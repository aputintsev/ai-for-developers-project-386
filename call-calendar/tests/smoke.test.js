import { afterAll, beforeAll, expect, test } from 'vitest'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'

let server
let baseUrl

beforeAll(async () => {
  server = await createServer({
    server: { host: '127.0.0.1', port: 0, open: false },
  })
  await server.listen()
  const address = server.httpServer.address()
  baseUrl = `http://127.0.0.1:${address.port}`
}, 30_000)

afterAll(async () => {
  await server?.close()
})

test('Vite starts and serves the application entry point', async () => {
  const response = await fetch(baseUrl)
  expect(response.status).toBe(200)
  expect(response.headers.get('content-type')).toContain('text/html')
  const html = await response.text()
  expect(html).toContain('<div id="root"></div>')
  expect(html).toContain('/src/main.tsx')

  const entry = await fetch(`${baseUrl}/src/main.tsx`)
  expect(entry.status).toBe(200)
  expect(await entry.text()).toContain('createRoot')
})

test('the main application renders its initial screen', async () => {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx')
  const html = renderToString(createElement(App))
  expect(html).toContain('<h1>Get started</h1>')
  expect(html).toMatch(/Count is (?:<!-- -->)?0/)
})
