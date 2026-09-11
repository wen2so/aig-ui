import type { LucideIcon, LucideProps } from 'lucide-react';
/** 传入按需导入的 Lucide 图标；label 省略时使用装饰语义。 */
export interface IconProps extends LucideProps {
  icon: LucideIcon;
  label?: string;
}
/** 以一致的视觉重量显示图标。 */
export function Icon({
  icon: Glyph,
  label,
  size = 20,
  strokeWidth = 1.5,
  className = '',
  ...props
}: IconProps) {
  return (
    <Glyph
      {...props}
      size={size}
      strokeWidth={strokeWidth}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`aig-icon ${className}`}
    />
  );
}
