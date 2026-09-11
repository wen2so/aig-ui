import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';

/** 生成显式导入，使新增组件立即进入开发服务器的预览目录。 */
const files = ['components', 'ai'].flatMap((group) => {
  const base = `packages/aig-ui/src/${group}`;
  if (!existsSync(base)) return [];
  return readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(({ name: id }) => {
      const file = `${base}/${id}/${id}.stories.tsx`;
      return existsSync(file) && readFileSync(file, 'utf8').includes('export const preview')
        ? [`${group}/${id}/${id}.stories.js`]
        : [];
    });
});
writeFileSync(
  'apps/preview/src/catalog.ts',
  `/** 由 scripts/preview-catalog.mjs 生成。 */\n${files.map((file, i) => `import * as component${i} from '../../../packages/aig-ui/src/${file}';`).join('\n')}\nexport const componentStories = [${files.map((file, i) => `{ ...component${i}, group: '${file.startsWith('ai/') ? 'AI' : '通用'}' }`).join(', ')}];\n`,
);
