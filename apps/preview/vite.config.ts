import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createApiReader } from '../../scripts/component-api.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
/** 直接复用发布资料的属性读取器，预览与源码修改同步。 */
function componentDocs(): Plugin {
  const id = '\0virtual:component-api';
  let apiFor: ReturnType<typeof createApiReader> | undefined;
  const invalidate = (server: ViteDevServer) => {
    apiFor = undefined;
    for (const [moduleId, module] of server.moduleGraph.idToModuleMap) {
      if (moduleId.startsWith(id)) server.moduleGraph.invalidateModule(module);
    }
    server.ws.send({ type: 'full-reload' });
  };
  return {
    name: 'aig-component-docs',
    configureServer(server) {
      // 新增或删除组件后重建虚拟目录和类型程序，避免长期运行的预览遗漏新 API。
      const refresh = (file: string) => {
        if (/\/packages\/aig-ui\/src\/.*\.tsx$/.test(file.replaceAll('\\', '/'))) invalidate(server);
      };
      server.watcher.on('add', refresh);
      server.watcher.on('unlink', refresh);
      server.httpServer?.once('close', () => {
        server.watcher.off('add', refresh);
        server.watcher.off('unlink', refresh);
      });
    },
    resolveId(source: string) {
      if (source === 'virtual:component-api' || source.startsWith('virtual:component-api/'))
        return `\0${source}`;
    },
    load(source: string) {
      if (source.startsWith(`${id}/`)) {
        apiFor ??= createApiReader(root);
        const [group, component, name] = source.slice(id.length + 1).split('/');
        const path =
          group === 'motion' || group === 'theme' ? `${component}.tsx` : `${component}/${component}.tsx`;
        return `export default ${JSON.stringify(apiFor(resolve(root, 'packages/aig-ui/src', group!, path), name!))}`;
      }
      if (source !== id) return;
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
          return [name, `virtual:component-api/${group}/${component}/${name}`];
        });
      });
      entries.push(['AigProvider', 'virtual:component-api/theme/aig-provider/AigProvider']);
      return `export default {${entries.map(([name, path]) => `${JSON.stringify(name)}: () => import(${JSON.stringify(path)})`).join(',')}}`;
    },
    handleHotUpdate(context) {
      if (
        context.file.replaceAll('\\', '/').includes('/packages/aig-ui/src/') &&
        context.file.endsWith('.tsx') &&
        !context.file.endsWith('.stories.tsx')
      ) {
        invalidate(context.server);
      }
    },
  };
}

export default defineConfig({
  plugins: [componentDocs()],
  build: { manifest: true },
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
