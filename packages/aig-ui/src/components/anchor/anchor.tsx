'use client';
import { useEffect, useState, type ComponentPropsWithRef } from 'react';
export interface AnchorItem {
  id: string;
  title: string;
}
export interface AnchorProps extends ComponentPropsWithRef<'nav'> {
  items: AnchorItem[];
  offset?: number;
}
/** 使用原生锚点保留地址与历史，滚动时观察当前可见章节。 */
export function Anchor({ items, offset = 80, className = '', ...props }: AnchorProps) {
  const [active, setActive] = useState('');
  useEffect(() => {
    const update = () => {
      const targets = items
        .map((item) => document.getElementById(item.id))
        .filter((node): node is HTMLElement => Boolean(node));
      const previous = targets.filter((node) => node.getBoundingClientRect().top <= offset + 1).at(-1);
      setActive(previous?.id ?? targets[0]?.id ?? '');
    };
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('hashchange', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('hashchange', schedule);
    };
  }, [items, offset]);
  return (
    <nav aria-label="页面章节" {...props} className={`aig-anchor ${className}`}>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${encodeURIComponent(item.id)}`}
          aria-current={active === item.id ? 'location' : undefined}
        >
          {item.title}
        </a>
      ))}
    </nav>
  );
}
