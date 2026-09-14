import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';

/** 主题层与组件、AI 组件共用同一份预览目录；主题作用域按文件组织，组件按目录组织。 */
const groups = [
  { dir: 'components', label: '通用' },
  { dir: 'ai', label: 'AI' },
  { dir: 'theme', label: '主题' },
];
/** 生成显式导入，使新增组件立即进入开发服务器的预览目录。 */
const files = groups.flatMap(({ dir, label }) => {
  const base = `packages/aig-ui/src/${dir}`;
  if (!existsSync(base)) return [];
  return readdirSync(base, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const id = entry.name.replace(/\.stories\.tsx$/, '');
      const relative = entry.isDirectory() ? `${id}/${id}` : id;
      const file = `${base}/${relative}.stories.tsx`;
      return existsSync(file) && readFileSync(file, 'utf8').includes('export const preview')
        ? [{ label, module: `${dir}/${relative}.stories.js` }]
        : [];
    });
});
writeFileSync(
  'apps/preview/src/catalog.ts',
  `/** 由 scripts/preview-catalog.mjs 生成。 */\n${files
    .map(({ module }, i) => `import * as component${i} from '../../../packages/aig-ui/src/${module}';`)
    .join('\n')}\nexport const componentStories = [${files
    .map(({ label }, i) => `{ ...component${i}, group: '${label}' }`)
    .join(', ')}];\n`,
);
