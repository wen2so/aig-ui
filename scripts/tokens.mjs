import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/** 校验项目使用的 DTCG 子集，解析引用并拒绝循环。 */
export function compileTokens(source) {
  const flat = new Map();
  function walk(group, path = []) {
    for (const [key, value] of Object.entries(group)) {
      if (key.startsWith('$')) continue;
      if (!value || typeof value !== 'object') throw Error(`Token 结构无效：${[...path, key].join('.')}`);
      if ('$value' in value) flat.set([...path, key].join('.'), value);
      else walk(value, [...path, key]);
    }
  }
  walk(source);
  function resolve(name, chain = []) {
    if (chain.includes(name)) throw Error(`Token 循环引用：${[...chain, name].join(' → ')}`);
    const token = flat.get(name);
    if (!token) throw Error(`Token 引用缺失：${name}`);
    let value = token.$value;
    if (typeof value === 'string' && /^\{.+\}$/.test(value)) {
      const target = value.slice(1, -1);
      if (flat.get(target)?.$type !== token.$type) throw Error(`Token 引用类型不一致：${name}`);
      return resolve(target, [...chain, name]);
    }
    switch (token.$type) {
      case 'color':
        if (value.colorSpace !== 'srgb' || value.components?.length !== 3 || !value.components.every(n => Number.isFinite(n) && n >= 0 && n <= 1)) throw Error(`颜色无效：${name}`);
        return `rgb(${value.components.map(n => Math.round(n * 255)).join(' ')})`;
      case 'dimension': case 'duration':
        if (!Number.isFinite(value.value) || value.value < 0 || !(token.$type === 'dimension' ? ['px', 'rem'] : ['ms', 's']).includes(value.unit)) throw Error(`数值或单位无效：${name}`);
        return `${value.value}${value.unit}`;
      case 'number':
        if (!Number.isFinite(value)) throw Error(`数值无效：${name}`);
        return String(value);
      default: throw Error(`Token 类型尚未支持：${token.$type}`);
    }
  }
  return Object.fromEntries([...flat.keys()].map(name => [name, resolve(name)]));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const tokens = compileTokens(JSON.parse(readFileSync('packages/aig-ui/src/tokens/source.json', 'utf8')));
  writeFileSync('packages/aig-ui/src/tokens/tokens.css', `/* 由 scripts/tokens.mjs 生成。 */\n:root {\n${Object.entries(tokens).map(([key, value]) => `  --aig-${key.replaceAll('.', '-')}: ${value};`).join('\n')}\n}\n`);
  const motion = Object.fromEntries(Object.entries(tokens).filter(([key]) => key.startsWith('motion.')).map(([key, value]) => [key.slice(7), parseFloat(value)]));
  writeFileSync('packages/aig-ui/src/tokens/motion.ts', `/** 从同一 Token 源生成的动效时长，单位为毫秒。 */\nexport const motionTiming = ${JSON.stringify(motion, null, 2)} as const;\n`);
}
