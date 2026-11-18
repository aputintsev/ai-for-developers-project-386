import { defineConfig } from 'orval'

export default defineConfig({
  calendar: {
    input: './api/openapi.yaml',
    output: {
      target: './src/api/generated/sdk.gen.ts',
      client: 'fetch',
      schemas: './src/api/generated/models',
      clean: true,
      baseUrl: { runtime: 'globalThis.location?.origin ?? ""' },
    },
  },
})
