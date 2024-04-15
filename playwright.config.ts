import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL ? process.env.BASE_URL :  'https://www.indeed.com/';

export default defineConfig({
  testDir: 'src/tests',
  timeout: 600 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  reporter: 'html',

  use: {
    headless: false,
    viewport: { width: 1366, height: 768 },
    baseURL: baseURL,
    trace: 'on',
    ignoreHTTPSErrors: true,
    launchOptions: {
      slowMo: 50,
    },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"], },
    },
    {
      name: "edge",
      use: { ...devices["Desktop Edge"], },
    },
  ]
});