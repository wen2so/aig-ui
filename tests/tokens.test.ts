import { expect, it } from 'vitest';
// @ts-expect-error Node 脚本直接作为运行时真源接受校验。
import { compileTokens } from '../scripts/tokens.mjs';

it('解析引用并拒绝循环、缺失和非法 Token', () => {
  expect(
    compileTokens({
      a: { $type: 'duration', $value: { value: 150, unit: 'ms' } },
      b: { $type: 'duration', $value: '{a}' },
    }).b,
  ).toBe('150ms');
  expect(compileTokens({ motion: { $type: 'duration', $value: { value: 1.2, unit: 's' } } }).motion).toBe(
    '1200ms',
  );
  expect(() => compileTokens({ a: { $type: 'number', $value: '{a}' } })).toThrow('循环');
  expect(() => compileTokens({ a: { $type: 'number', $value: '{b}' } })).toThrow();
  expect(() => compileTokens({ a: { $type: 'dimension', $value: { value: -1, unit: 'px' } } })).toThrow();
  expect(() => compileTokens({ a: { $type: 'unknown', $value: 1 } })).toThrow('尚未支持');
  const color = { colorSpace: 'srgb', components: [1, 1, 1], alpha: 0.7 };
  expect(
    compileTokens({
      glass: {
        $type: 'gradient',
        $value: [
          { color, position: 0 },
          { color, position: 1 },
        ],
      },
    }).glass,
  ).toContain('rgb(255 255 255 / 0.7) 100%');
  expect(() => compileTokens({ color: { $type: 'color', $value: { ...color, alpha: 2 } } })).toThrow(
    '透明度',
  );
  expect(() =>
    compileTokens({
      glass: {
        $type: 'gradient',
        $value: [
          { color, position: -1 },
          { color, position: 1 },
        ],
      },
    }),
  ).toThrow('位置');
  const dimension = (value: number) => ({ value, unit: 'px' });
  const shadow = {
    color,
    offsetX: dimension(0),
    offsetY: dimension(1),
    blur: dimension(10),
    spread: dimension(-4),
    inset: true,
  };
  expect(compileTokens({ shadow: { $type: 'shadow', $value: shadow } }).shadow).toBe(
    'inset 0px 1px 10px -4px rgb(255 255 255 / 0.7)',
  );
  expect(() =>
    compileTokens({ shadow: { $type: 'shadow', $value: { ...shadow, blur: dimension(-1) } } }),
  ).toThrow('阴影');
  expect(
    compileTokens({ font: { $type: 'fontFamily', $value: ['Noto Sans SC', 'system-ui', 'serif'] } }).font,
  ).toBe("'Noto Sans SC', system-ui, serif");
  expect(compileTokens({ font: { $type: 'fontFamily', $value: 'Consolas' } }).font).toBe('Consolas');
  expect(() => compileTokens({ font: { $type: 'fontFamily', $value: [] } })).toThrow('字体栈');
  expect(() => compileTokens({ font: { $type: 'fontFamily', $value: ['  '] } })).toThrow('字体栈');
});
