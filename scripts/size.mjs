import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { build } from 'vite';

/** 从独立安装包测量入口，React 作为宿主依赖单独计算。 */
const installed = resolve('examples/vite-consumer/node_modules/aig-ui');
const pkg = JSON.parse(readFileSync(resolve(installed, 'package.json'), 'utf8'));
const entryPath = (specifier) => {
  const target = pkg.exports['.' + specifier.slice('aig-ui'.length)];
  return resolve(installed, typeof target === 'string' ? target : target.import);
};
const results = {};
for (const [name, specifier] of [
  ['button', 'aig-ui/button'],
  ['motion', 'aig-ui/motion'],
  ['ai', 'aig-ui/ai'],
]) {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    build: {
      write: false,
      minify: true,
      lib: { entry: entryPath(specifier), formats: ['es'] },
      rolldownOptions: { external: [/^react(?:\/|$)/, /^react-dom(?:\/|$)/] },
    },
  });
  const chunks = (Array.isArray(result) ? result : [result])
    .flatMap((bundle) => bundle.output)
    .filter((chunk) => chunk.type === 'chunk');
  const code = chunks.map((chunk) => chunk.code).join('\n');
  if (
    name === 'button' &&
    chunks.some((chunk) =>
      Object.keys(chunk.modules).some((module) => /react-markdown|remark-gfm|safe-markdown/.test(module)),
    )
  )
    throw Error('Button 入口意外包含 AI Markdown 依赖');
  results[name] = { javascriptBytes: Buffer.byteLength(code), gzipBytes: gzipSync(code).byteLength };
}
for (const path of ['styles.css', 'motion/styles.css', 'ai/styles.css']) {
  const css = readFileSync(entryPath(`aig-ui/${path}`));
  results[path] = { bytes: css.byteLength, gzipBytes: gzipSync(css).byteLength };
}
// 预览入口按 manifest 收集静态依赖，排除仅在打开详情后请求的动态块。
const previewRoot = resolve('apps/preview/dist');
const manifest = JSON.parse(readFileSync(resolve(previewRoot, '.vite/manifest.json'), 'utf8'));
const visited = new Set();
function collect(key) {
  if (visited.has(key)) return;
  visited.add(key);
  for (const dependency of manifest[key].imports ?? []) collect(dependency);
}
collect('index.html');
const initialChunks = [...visited].map((key) => readFileSync(resolve(previewRoot, manifest[key].file)));
results.preview = {
  javascriptBytes: initialChunks.reduce((total, code) => total + code.byteLength, 0),
  gzipBytes: initialChunks.reduce((total, code) => total + gzipSync(code).byteLength, 0),
};
const budgetPath = resolve('scripts/size-budgets.json');
if (process.argv.includes('--update-baseline')) {
  if (process.env.CI) throw Error('CI 不允许自动更新体积基线');
  writeFileSync(budgetPath, JSON.stringify({ growthAllowance: 0.1, entries: results }, null, 2) + '\n');
}
const budget = JSON.parse(readFileSync(budgetPath, 'utf8'));
const violations = [];
for (const [name, metrics] of Object.entries(results)) {
  for (const [metric, actual] of Object.entries(metrics)) {
    const baseline = budget.entries[name]?.[metric];
    if (!Number.isFinite(baseline) || baseline <= 0) throw Error(`缺少有效体积基线: ${name}.${metric}`);
    const maximum = Math.ceil(baseline * (1 + budget.growthAllowance));
    if (actual > maximum) violations.push(`${name}.${metric}: ${actual} > ${maximum} bytes`);
  }
}
writeFileSync(
  'artifacts/size-report.json',
  JSON.stringify(
    {
      environment: { node: process.version, platform: process.platform, architecture: process.arch },
      reactExternal: true,
      entries: results,
      growthAllowance: budget.growthAllowance,
      violations,
    },
    null,
    2,
  ) + '\n',
);
console.log(JSON.stringify(results, null, 2));
if (violations.length) throw Error(`体积超过增长预算:\n${violations.join('\n')}`);
