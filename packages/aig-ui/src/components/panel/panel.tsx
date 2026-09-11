import type { ComponentPropsWithRef } from 'react';
type PartProps = ComponentPropsWithRef<'div'>;
/** 面板支持自然伸展；scroll 时由宿主设置高度或最大高度。 */
function Root({ scroll = false, className = '', ...props }: PartProps & { scroll?: boolean }) {
  return <div {...props} data-scroll={scroll || undefined} className={`aig-panel ${className}`} />;
}
/** 面板标题与操作。 */
function Header({ className = '', ...props }: PartProps) {
  return <div {...props} className={`aig-panel-header ${className}`} />;
}
/** 面板正文，在滚动模式下占据剩余高度。 */
function Body({ className = '', ...props }: PartProps) {
  return <div {...props} className={`aig-panel-body ${className}`} />;
}
/** 固定在正文之后的操作区域。 */
function Footer({ className = '', ...props }: PartProps) {
  return <div {...props} className={`aig-panel-footer ${className}`} />;
}
/** 可组合的面板部件。 */
export const Panel = Object.assign(Root, { Header, Body, Footer });
