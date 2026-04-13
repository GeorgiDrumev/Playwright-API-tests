import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  retries: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['@testomatio/reporter/lib/adapter/playwright.js', { apiKey: process.env.TESTOMATIO }],
  ],
  use: {
    baseURL: 'https://sandbox.mockerito.com',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
    trace: 'retain-on-failure',
  },
});
