import { defineConfig } from '@playwright/test';

// Isolated export tests only: never point synthetic journeys at production.
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45000,
  retries: 0,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'off',
    screenshot: 'only-on-failure',
  },
  projects: [320, 390, 768, 1440].map((width) => ({
    name: `chromium-${width}`,
    use: { browserName: 'chromium', viewport: { width, height: 900 } },
  })),
  webServer: {
    command: 'node scripts/preview.mjs',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
});
