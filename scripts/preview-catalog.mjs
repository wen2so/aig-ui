import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

/** 生成显式导入，使新增组件立即进入开发服务器的预览目录。 */
const base = 'packages/aig-ui/src/components';
const files = readdirSync(base).sort().flatMap(id => {
  const file = `${base}/${id}/${id}.stories.tsx`;
  return readFileSync(file, 'utf8').includes('export const preview') ? [`${id}/${id}.stories.js`] : [];
});
writeFileSync('apps/preview/src/catalog.ts', `/** 由 scripts/preview-catalog.mjs 生成。 */\n${files.map((file, i) => `import * as component${i} from '../../../packages/aig-ui/src/components/${file}';`).join('\n')}\nexport const componentStories = [${files.map((_, i) => `component${i}`).join(', ')}];\n`);
