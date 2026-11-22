import { defineConfig } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
  testDir: 'e2e',
  timeout: 180_000,
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: `http://localhost:${PORT}`, channel: 'chrome' },
  projects: [
    {
      name: 'phone',
      use: { viewport: { width: 360, height: 740 }, hasTouch: true },
    },
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
  ],
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
