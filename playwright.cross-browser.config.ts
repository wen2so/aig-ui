import { defineConfig } from '@playwright/test';
import preview from './playwright.preview.config.js';
export default defineConfig(preview, {
  outputDir: './test-results/cross-browser',
  testIgnore: [],
  testMatch: ['interactions.spec.ts', 'audit-regressions.spec.ts'],
  projects: [
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
