import type { ComponentPropsWithRef } from 'react';
/** 默认玻璃表面，可按阅读场景显式使用实色材质。 */
export interface CardProps extends ComponentPropsWithRef<'div'> {
  material?: 'solid' | 'glass';
}
/** 容纳一个完整内容组。 */
export function Card({ material = 'glass', className = '', ...props }: CardProps) {
  return <div {...props} data-material={material} className={`aig-card ${className}`} />;
}
