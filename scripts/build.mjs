import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/** 展开本地 CSS 引用，保持显式样式入口可独立分发。 */
function css(file, stack = []) {
  if (stack.includes(file)) throw Error(`CSS 循环引用：${file}`);
  return readFileSync(file, 'utf8').replace(/@import\s+'([^']+)';/g, (_, ref) => css(resolve(dirname(file), ref), [...stack, file]));
}
mkdirSync('packages/aig-ui/dist', { recursive: true });
writeFileSync('packages/aig-ui/dist/styles.css', css(resolve('packages/aig-ui/src/styles.css')));
writeFileSync('packages/aig-ui/dist/tokens.css', readFileSync('packages/aig-ui/src/tokens/tokens.css'));
