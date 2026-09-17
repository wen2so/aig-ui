import { defineConfig } from '@playwright/test';
import preview from './playwright.preview.config.js';
export default defineConfig(preview, {
  outputDir: './test-results/motion',
  workers: 1,
  testIgnore: [],
  testMatch: ['*motion.spec.ts', 'button-performance.spec.ts'],
});
