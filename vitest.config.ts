/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [],
  test: {
    include: ['**/*.test.ts'],
    testTimeout: 30_000,
  },
})
