import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';
import { createHash } from 'node:crypto';
import Ajv from 'ajv';

/** 使用固定的官方 schema 验证本地源码分发资料。 */
const ajv = new Ajv({ strict: false, allErrors: true });
ajv.addMetaSchema(
  ajv.getSchema('http://json-schema.org/draft-07/schema').schema,
  'https://json-schema.org/draft-07/schema',
);
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const itemSchema = read('scripts/schemas/registry-item.json');
ajv.addSchema(itemSchema, 'https://ui.shadcn.com/schema/registry-item.json');
const validate = ajv.compile(read('scripts/schemas/registry.json'));
const itemValidate = ajv.getSchema('https://ui.shadcn.com/schema/registry-item.json');
const manifest = read('packages/aig-ui/dist/manifest.json');
const registry = read('registry/registry.json');
const output = `artifacts/registry/${manifest.libraryVersion}/r`;
mkdirSync(output, { recursive: true });
registry.items = registry.items.map((item) => {
  if (!/^[a-z][a-z-]+$/.test(item.name)) throw Error('Registry 名称必须是安全的路径片段');
  const path = `registry/blocks/${item.name}/${item.name}.tsx`;
  const content = readFileSync(path, 'utf8');
  const result = {
    ...item,
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    dependencies: [`aig-ui@${manifest.libraryVersion}`],
    files: [{ path, target: `components/aig-ui/${item.name}.tsx`, type: 'registry:component', content }],
    docs: '在应用入口导入 aig-ui/styles.css、aig-ui/motion/styles.css 和 aig-ui/ai/styles.css。业务数据与操作通过 Props 接入。当前版本为本地 Alpha，消费验证使用同版本 tarball。',
    meta: {
      libraryVersion: manifest.libraryVersion,
      sourceCommit: manifest.sourceCommit,
      sourceDirty: manifest.sourceDirty,
      sha256: createHash('sha256').update(content).digest('hex'),
    },
  };
  if (!itemValidate(result)) throw Error(JSON.stringify(itemValidate.errors));
  writeFileSync(`${output}/${item.name}.json`, JSON.stringify(result, null, 2) + '\n');
  return result;
});
if (!validate(registry)) throw Error(JSON.stringify(validate.errors));
writeFileSync(`${output}/registry.json`, JSON.stringify(registry, null, 2) + '\n');
cpSync(output, 'packages/aig-ui/dist/r', { recursive: true });
console.log(`Registry 官方 schema 校验通过：${registry.items.length} 个页面组合。`);
