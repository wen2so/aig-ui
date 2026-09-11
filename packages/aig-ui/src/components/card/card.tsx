import type { ComponentPropsWithRef } from 'react';
/** 默认实色表面，可按场景显式使用玻璃材质。 */
export interface CardProps extends ComponentPropsWithRef<'div'> { material?: 'solid' | 'glass'; }
/** 容纳一个完整内容组。 */
export function Card({ material = 'solid', className = '', ...props }: CardProps) { return <div {...props} data-material={material} className={`aig-card ${className}`} />; }
