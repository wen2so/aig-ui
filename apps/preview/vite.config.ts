import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({ resolve: { alias: [
  { find: /^aig-ui\/motion$/, replacement: fileURLToPath(new URL('../../packages/aig-ui/src/motion/index.ts', import.meta.url)) },
  { find: /^aig-ui\/ai$/, replacement: fileURLToPath(new URL('../../packages/aig-ui/src/ai/index.ts', import.meta.url)) },
  { find: /^aig-ui$/, replacement: fileURLToPath(new URL('../../packages/aig-ui/src/index.ts', import.meta.url)) },
] } });
