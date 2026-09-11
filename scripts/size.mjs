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
writeFileSync(
  'artifacts/size-report.json',
  JSON.stringify(
    {
      environment: { node: process.version, platform: process.platform, architecture: process.arch },
      reactExternal: true,
      entries: results,
    },
    null,
    2,
  ) + '\n',
);
console.log(JSON.stringify(results, null, 2));
