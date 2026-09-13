import { defineConfig, type Plugin } from 'vite';
import { fileURLToPath } from 'node:url';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createApiReader } from '../../scripts/component-api.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
/** 直接复用发布资料的属性读取器，预览与源码修改同步。 */
function componentDocs(): Plugin {
  const id = '\0virtual:component-api';
  return {
    name: 'aig-component-docs',
    resolveId(source: string) {
      if (source === 'virtual:component-api') return id;
    },
    load(source: string) {
      if (source !== id) return;
      const apiFor = createApiReader(root);
      const entries = ['components', 'ai', 'motion'].flatMap((group) => {
        const base = resolve(root, 'packages/aig-ui/src', group);
        const ids =
          group === 'motion'
            ? ['loading-mark', 'loading-sequence']
            : readdirSync(base, { withFileTypes: true })
                .filter((entry) => entry.isDirectory())
                .map((entry) => entry.name);
        return ids.map((component) => {
          const name = component
            .split('-')
            .map((word) => word[0]!.toUpperCase() + word.slice(1))
            .join('');
          return [
            name,
            apiFor(
              resolve(base, group === 'motion' ? `${component}.tsx` : `${component}/${component}.tsx`),
              name,
            ),
          ];
        });
      });
      entries.push([
        'AigProvider',
        apiFor(resolve(root, 'packages/aig-ui/src/theme/aig-provider.tsx'), 'AigProvider'),
      ]);
      return `export default ${JSON.stringify(Object.fromEntries(entries))}`;
    },
    handleHotUpdate(context) {
      if (
        context.file.replaceAll('\\', '/').includes('/packages/aig-ui/src/') &&
        context.file.endsWith('.tsx') &&
        !context.file.endsWith('.stories.tsx')
      ) {
        const module = context.server.moduleGraph.getModuleById(id);
        if (module) context.server.moduleGraph.invalidateModule(module);
        context.server.ws.send({ type: 'full-reload' });
      }
    },
  };
}

export default defineConfig({
  plugins: [componentDocs()],
  resolve: {
    alias: [
      {
        find: /^aig-ui\/motion$/,
        replacement: fileURLToPath(new URL('../../packages/aig-ui/src/motion/index.ts', import.meta.url)),
      },
      {
        find: /^aig-ui\/ai$/,
        replacement: fileURLToPath(new URL('../../packages/aig-ui/src/ai/index.ts', import.meta.url)),
      },
      {
        find: /^aig-ui$/,
        replacement: fileURLToPath(new URL('../../packages/aig-ui/src/index.ts', import.meta.url)),
      },
    ],
  },
});
