import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/** 通用字体族按 CSS 关键字原样输出，含空格的具体字体名使用单引号。 */
const GENERIC_FAMILIES = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  'math',
  'emoji',
  'fangsong',
]);
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
        if (
          value.colorSpace !== 'srgb' ||
          value.components?.length !== 3 ||
          !value.components.every((n) => Number.isFinite(n) && n >= 0 && n <= 1)
        )
          throw Error(`颜色无效：${name}`);
        if (
          value.alpha !== undefined &&
          (!Number.isFinite(value.alpha) || value.alpha < 0 || value.alpha > 1)
        )
          throw Error(`透明度无效：${name}`);
        return `rgb(${value.components.map((n) => Math.round(n * 255)).join(' ')}${value.alpha === undefined ? '' : ` / ${value.alpha}`})`;
      case 'gradient':
        if (!Array.isArray(value) || value.length < 2) throw Error(`渐变无效：${name}`);
        return value
          .map((stop) => {
            if (!Number.isFinite(stop.position) || stop.position < 0 || stop.position > 1)
              throw Error(`渐变位置无效：${name}`);
            const color = compileTokens({ stop: { $type: 'color', $value: stop.color } }).stop;
            return `${color} ${stop.position * 100}%`;
          })
          .join(', ');
      case 'shadow':
        return (Array.isArray(value) ? value : [value])
          .map((shadow) => {
            const color = compileTokens({ color: { $type: 'color', $value: shadow.color } }).color;
            const lengths = ['offsetX', 'offsetY', 'blur', 'spread'].map((key) => {
              const length = shadow[key];
              if (
                !Number.isFinite(length?.value) ||
                length.unit !== 'px' ||
                (key === 'blur' && length.value < 0)
              )
                throw Error(`阴影无效：${name}`);
              return `${length.value}px`;
            });
            return `${shadow.inset ? 'inset ' : ''}${lengths.join(' ')} ${color}`;
          })
          .join(', ');
      case 'dimension':
      case 'duration':
        if (
          !Number.isFinite(value.value) ||
          value.value < 0 ||
          !(token.$type === 'dimension' ? ['px', 'rem'] : ['ms', 's']).includes(value.unit)
        )
          throw Error(`数值或单位无效：${name}`);
        return token.$type === 'duration' && value.unit === 's'
          ? `${value.value * 1000}ms`
          : `${value.value}${value.unit}`;
      case 'fontFamily': {
        const families = Array.isArray(value) ? value : [value];
        if (!families.length || !families.every((item) => typeof item === 'string' && item.trim()))
          throw Error(`字体栈无效：${name}`);
        return families
          .map((family) => family.trim())
          .map((family) => (GENERIC_FAMILIES.has(family) || !/\s/.test(family) ? family : `'${family}'`))
          .join(', ');
      }
      case 'number':
        if (!Number.isFinite(value)) throw Error(`数值无效：${name}`);
        return String(value);
      default:
        throw Error(`Token 类型尚未支持：${token.$type}`);
    }
  }
  return Object.fromEntries([...flat.keys()].map((name) => [name, resolve(name)]));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const tokens = compileTokens(JSON.parse(readFileSync('packages/aig-ui/src/tokens/source.json', 'utf8')));
  writeFileSync(
    'packages/aig-ui/src/tokens/tokens.css',
    `/* 由 scripts/tokens.mjs 生成。 */\n:root {\n${Object.entries(tokens)
      .map(([key, value]) => `  --aig-${key.replaceAll('.', '-')}: ${value};`)
      .join('\n')}\n}\n`,
  );
  const motion = Object.fromEntries(
    Object.entries(tokens)
      .filter(([key]) => key.startsWith('motion.'))
      .map(([key, value]) => [key.slice(7), parseFloat(value)]),
  );
  writeFileSync(
    'packages/aig-ui/src/tokens/motion.ts',
    `/** 从同一 Token 源生成的动效时长，单位为毫秒。 */\nexport const motionTiming = ${JSON.stringify(motion, null, 2)} as const;\n`,
  );
}
