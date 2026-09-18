import type { ComponentPropsWithRef } from 'react';
/** 页面分区可组合；窄屏侧栏回到文档流，由内容共同撑开高度。 */
function Root({ className = '', ...props }: ComponentPropsWithRef<'div'>) {
  return <div {...props} className={`aig-layout ${className}`} />;
}
function Header({ className = '', ...props }: ComponentPropsWithRef<'header'>) {
  return <header {...props} className={`aig-layout-header ${className}`} />;
}
function Aside({ className = '', ...props }: ComponentPropsWithRef<'aside'>) {
  return <aside {...props} className={`aig-layout-aside ${className}`} />;
}
function Content({ className = '', ...props }: ComponentPropsWithRef<'div'>) {
  return <div {...props} className={`aig-layout-content ${className}`} />;
}
function Footer({ className = '', ...props }: ComponentPropsWithRef<'footer'>) {
  return <footer {...props} className={`aig-layout-footer ${className}`} />;
}
export const Layout = Object.assign(Root, { Header, Aside, Content, Footer });
