/** 合并固定样式和 Base UI 的字符串或状态样式。 */
export function classNames<State>(base: string, custom?: string | ((state: State) => string | undefined)) {
  return (state: State) => [base, typeof custom === 'function' ? custom(state) : custom].filter(Boolean).join(' ');
}
