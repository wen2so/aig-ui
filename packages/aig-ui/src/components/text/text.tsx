import type { ComponentPropsWithRef } from 'react';
/** 正文大小和语义色。 */
export interface TextProps extends ComponentPropsWithRef<'p'> {
  as?: 'p' | 'span';
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'muted' | 'success' | 'warning' | 'danger';
}
/** 在原生段落或行内元素中显示文本。 */
export function Text({ as: Tag = 'p', size = 'md', tone = 'default', className = '', ...props }: TextProps) {
  return <Tag {...props} data-size={size} data-tone={tone} className={`aig-text ${className}`} />;
}
