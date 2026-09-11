import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

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
const pages = readFileSync('apps/preview/src/pages.tsx', 'utf8')
  .replaceAll(/\.\.\/\.\.\/\.\.\/registry\/blocks\/([^/]+)\/[^']+/g, './registry/$1.js')
  .replace('../../../packages/aig-ui/src/ai/task-status/task-status.js', 'aig-ui/ai');
writeFileSync('examples/vite-consumer/src/pages.tsx', pages);
console.log(`独立项目已准备 ${items.length} 个 Registry 页面源码。`);
