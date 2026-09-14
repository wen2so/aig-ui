import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

/** 从已安装的 Lucide 生成原生复选框遮罩，保持图形来源与 React 图标一致。 */
const require = createRequire(new URL('../packages/aig-ui/package.json', import.meta.url));
const { Check, Minus } = require('lucide-react');
const masks = Object.entries({ check: Check, minus: Minus }).map(([name, icon]) => {
  const svg = renderToStaticMarkup(createElement(icon, { size: 24, strokeWidth: 2, color: 'black' }));
  return `  --aig-icon-${name}: url("data:image/svg+xml,${encodeURIComponent(svg)}");`;
});
writeFileSync(
  new URL('../packages/aig-ui/src/internal/icon-masks.css', import.meta.url),
  `/* 由 scripts/icons.mjs 从 Lucide 生成。 */\n:root {\n${masks.join('\n')}\n}\n`,
);
