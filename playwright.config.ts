import { defineConfig } from '@playwright/test';

export default defineConfig({ testDir: './tests/browser', use: { viewport: { width: 1280, height: 720 } }, webServer: { command: 'pnpm --dir examples/vite-consumer dev', url: 'http://127.0.0.1:4173', reuseExistingServer: false }, reporter: 'list' });
