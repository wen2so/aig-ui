import ts from 'typescript';
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
/** 仅提取字符串元数据，目录不执行或静态导入 Story。 */
function metadata(file) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const objects = [];
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const values = Object.fromEntries(
        node.properties.flatMap((prop) =>
          ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name) && ts.isStringLiteral(prop.initializer)
            ? [[prop.name.text, prop.initializer.text]]
            : [],
        ),
      );
      if (values.name && values.label && values.description) objects.push(values);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return objects;
}
writeFileSync(
  'apps/preview/src/catalog.ts',
  `/** 由 scripts/preview-catalog.mjs 生成。 */
export const componentStories = [${files
    .map(({ module }) => {
      const info = metadata(`packages/aig-ui/src/${module.replace(/\.js$/, '.tsx')}`)[0];
      if (!info) throw Error(`缺少目录元数据: ${module}`);
      return `{ preview: ${JSON.stringify(info)}, load: () => import('../../../packages/aig-ui/src/${module}') }`;
    })
    .join(',\n')}];
export const pageMetadata = ${JSON.stringify(metadata('apps/preview/src/pages.tsx'))};
`,
);
