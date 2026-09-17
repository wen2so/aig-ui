import type { Example } from './example-helpers.js';
export type { Example } from './example-helpers.js';
const loaders = import.meta.glob('./examples/*.tsx', { import: 'default' }) as Record<
  string,
  () => Promise<Example[]>
>;
/** 只读取当前组件的扩展示例与源码字符串。 */
export function loadExtraExamples(name: string): Promise<Example[]> {
  return loaders[`./examples/${name}.tsx`]?.() ?? Promise.resolve([]);
}
