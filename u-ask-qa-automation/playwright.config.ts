import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://u-ask.example.gov.ae'; // replace with real URL

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 30_000
  },
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  projects: [
    {
      name: 'Desktop Chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13']
      }
    }
  ]
});
