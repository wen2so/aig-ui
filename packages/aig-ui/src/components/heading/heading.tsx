import type { ComponentPropsWithRef, ElementType } from 'react';
/** 标题级别默认 2，视觉尺寸默认 md。 */
export interface HeadingProps extends ComponentPropsWithRef<'h2'> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'sm' | 'md' | 'lg';
}
/** 使用真实 h1–h6 元素表达信息结构。 */
export function Heading({ level = 2, size = 'md', className = '', ...props }: HeadingProps) {
  const Tag = `h${level}` as ElementType;
  return <Tag {...props} data-size={size} className={`aig-heading ${className}`} />;
}
