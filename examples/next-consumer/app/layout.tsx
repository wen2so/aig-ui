import type { ReactNode } from 'react';
import './host.css';
import 'aig-ui/styles.css';
import 'aig-ui/motion/styles.css';
import 'aig-ui/ai/styles.css';
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
