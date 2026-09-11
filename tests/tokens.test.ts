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
});
