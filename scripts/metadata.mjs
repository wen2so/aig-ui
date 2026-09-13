import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, existsSync } from 'node:fs';
import { resolve, dirname, relative, posix } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import { createApiReader } from './component-api.mjs';

const source = resolve('packages/aig-ui/src');
const output = resolve('packages/aig-ui/dist');
const pkg = JSON.parse(readFileSync('packages/aig-ui/package.json', 'utf8'));
const slash = (path) => path.replaceAll('\\', '/');
const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile).config;
const parsed = ts.parseJsonConfigFileContent(config, ts.sys, process.cwd());
const apiFor = createApiReader();
const provenance = {
  schemaVersion: '1.0',
  library: pkg.name,
  libraryVersion: pkg.version,
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  sourceDirty: Boolean(execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim()),
};
const components = [];
const exampleFiles = [];
function write(path, data) {
  const file = resolve(output, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n');
}
cpSync(source, resolve(output, 'source'), {
  recursive: true,
  filter: (path) => !/\.(test|stories)\.tsx?$/.test(path),
});
cpSync('reference/404.html', resolve(output, 'reference.html'));

for (const group of ['components', 'motion', 'ai']) {
  const ids =
    group === 'motion'
      ? ['loading-mark', 'loading-sequence']
      : readdirSync(resolve(source, group), { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => entry.name)
          .sort();
  for (const id of ids) {
    const module = group === 'motion' ? `${group}/${id}` : `${group}/${id}/${id}`;
    const file = resolve(source, `${module}.tsx`);
    const name = id
      .split('-')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join('');
    const readme = readFileSync(resolve(dirname(file), 'README.md'), 'utf8');
    const storyFile = `${file.slice(0, -4)}.stories.tsx`;
    const story = readFileSync(storyFile, 'utf8');
    const importPath =
      group === 'motion' ? 'aig-ui/motion' : group === 'ai' ? `aig-ui/ai/${id}` : `aig-ui/${id}`;
    const entry = {
      ...provenance,
      id,
      name,
      summary:
        readme.split(/\r?\n/).find((line) => line.startsWith(name)) ??
        readme.split(/\r?\n/).find((line) => line && !line.startsWith('#')),
      status: 'experimental',
      importPath,
      styleImports: ['aig-ui/styles.css', ...(group === 'components' ? [] : [`aig-ui/${group}/styles.css`])],
      propsRef: `api/${id}.json`,
      sourceRef: `source/${module}.tsx`,
      declarationRef: `${module}.d.ts`,
      documentationRef: `components/${id}.md`,
      examples: [`examples/${id}.tsx`],
      sourceSha256: createHash('sha256').update(readFileSync(file)).digest('hex'),
    };
    components.push(entry);
    write(entry.propsRef, {
      ...provenance,
      id,
      declarationRef: entry.declarationRef,
      signatures: apiFor(file, name),
    });
    write(`components/${id}.json`, entry);
    write(
      entry.documentationRef,
      `${readme}\n版本：${pkg.version}。API 由同版本 TypeScript 声明生成，默认值与使用约束见上文及源码。\n`,
    );
    // 示例保留实际 Story 内容，把相对引用定向到同一份源码快照。
    const example = story.replace(/(from\s+|import\s+)(['"])(\.[^'"]+)\2/g, (_, prefix, quote, specifier) => {
      const [path, query] = specifier.split('?');
      const target = resolve(dirname(storyFile), path);
      const snapshot = target.startsWith(source)
        ? `source/${slash(relative(source, target))}`
        : 'reference.html';
      return `${prefix}${quote}${posix.relative('examples', snapshot)}${query ? '?' + query : ''}${quote}`;
    });
    write(entry.examples[0], example);
    exampleFiles.push(resolve(output, entry.examples[0]));
    for (const ref of [
      entry.sourceRef,
      entry.declarationRef,
      entry.documentationRef,
      entry.propsRef,
      ...entry.examples,
    ]) {
      if (!existsSync(resolve(output, ref))) throw Error(`资料引用缺失：${ref}`);
    }
  }
}
if (components.length !== 50) throw Error(`组件目录数量异常：${components.length}`);
const configuration = {
  name: 'AigProvider',
  importPath: 'aig-ui',
  propsRef: 'api/aig-provider.json',
  sourceRef: 'source/theme/aig-provider.tsx',
};
write(configuration.propsRef, {
  ...provenance,
  declarationRef: 'theme/aig-provider.d.ts',
  signatures: apiFor(resolve(source, 'theme/aig-provider.tsx'), 'AigProvider'),
});
write(
  'design.md',
  readFileSync('docs/component-design.md', 'utf8') +
    `\n包版本：${pkg.version}。源码提交：${provenance.sourceCommit}。\n`,
);
const manifest = { ...provenance, status: 'experimental', designRef: 'design.md', configuration, components };
write('manifest.json', manifest);
if (Buffer.byteLength(JSON.stringify(manifest, null, 2)) > 100 * 1024)
  throw Error('manifest 超出 100 KB 预算');
const intro = `# aig-ui ${pkg.version}\n\n实验性 React 组件库。先导入 aig-ui/styles.css，动效与 AI 使用独立入口及样式。\n使用公开 Props 与实际示例；业务请求、鉴权和执行确认由宿主完成。\n\n`;
write(
  'llms.txt',
  intro +
    '- [组件视觉用法](design.md): 方案 2.2 的材料、几何、自主运动、加载与 AI 组合。\n' +
    components.map((item) => `- [${item.name}](${item.documentationRef}): ${item.summary}`).join('\n') +
    '\n',
);
write(
  'llms-full.txt',
  intro + components.map((item) => readFileSync(resolve(output, item.documentationRef), 'utf8')).join('\n\n'),
);
const examples = ts.createProgram([...exampleFiles, resolve('apps/preview/src/vite-env.d.ts')], {
  ...parsed.options,
  noEmit: true,
});
const diagnostics = ts.getPreEmitDiagnostics(examples);
if (diagnostics.length)
  throw Error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getCanonicalFileName: (file) => file,
      getNewLine: () => '\n',
    }),
  );
console.log(`资料生成完成：${components.length} 个组件，示例类型检查通过。`);
