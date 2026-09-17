import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import ts from 'typescript';

/** 从安装项 JSON 提取源码供独立消费项目编译，校验路径与内容散列。 */
const { items } = JSON.parse(readFileSync('packages/aig-ui/dist/r/registry.json', 'utf8'));
const destination = 'examples/vite-consumer/src/registry';
mkdirSync(destination, { recursive: true });
for (const item of items) {
  if (!/^[a-z][a-z-]+$/.test(item.name) || item.files.length !== 1) throw Error('安装项路径或文件数量异常');
  const file = item.files[0];
  if (file.target !== `components/aig-ui/${item.name}.tsx`) throw Error('安装目标超出组件目录');
  if (createHash('sha256').update(file.content).digest('hex') !== item.meta.sha256)
    throw Error('源码校验值不一致');
  writeFileSync(`${destination}/${item.name}.tsx`, file.content);
}
// 消费验证只保留 Registry 页面，预览专属样板不属于安装项。
const source = ts.createSourceFile(
  'pages.tsx',
  readFileSync('apps/preview/src/pages.tsx', 'utf8'),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const names = new Set(items.map((item) => item.name));
const transformed = ts.transform(source, [
  (context) => {
    const visit = (node) => {
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === './visual-study.js') return undefined;
      if (ts.isVariableDeclaration(node) && node.name.getText(source) === 'pageEntries') {
        const entries = node.initializer.elements.filter((entry) =>
          entry.properties.some(
            (property) =>
              ts.isPropertyAssignment(property) &&
              property.name.getText(source) === 'name' &&
              names.has(property.initializer.text),
          ),
        );
        return ts.factory.updateVariableDeclaration(
          node,
          node.name,
          node.exclamationToken,
          node.type,
          ts.factory.updateArrayLiteralExpression(node.initializer, entries),
        );
      }
      return ts.visitEachChild(node, visit, context);
    };
    return (root) => ts.visitNode(root, visit);
  },
]);
const pages = ts
  .createPrinter()
  .printFile(transformed.transformed[0])
  .replaceAll(/\.\.\/\.\.\/\.\.\/registry\/blocks\/([^/]+)\/[^']+/g, './registry/$1.js')
  .replace('../../../packages/aig-ui/src/ai/task-status/task-status.js', 'aig-ui/ai');
writeFileSync('examples/vite-consumer/src/pages.tsx', pages);
transformed.dispose();
console.log(`独立项目已准备 ${items.length} 个 Registry 页面源码。`);
