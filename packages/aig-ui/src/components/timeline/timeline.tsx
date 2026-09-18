import type { ComponentPropsWithRef, ReactNode } from 'react';
export interface TimelineItem {
  id: string;
  title: ReactNode;
  time?: string;
  dateTime?: string;
  description?: ReactNode;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
}
export interface TimelineProps extends ComponentPropsWithRef<'ol'> {
  items: TimelineItem[];
}
/** 按宿主提供的顺序展示事件，不推断时间或任务完成情况。 */
export function Timeline({ items, className = '', ...props }: TimelineProps) {
  return (
    <ol {...props} className={`aig-timeline ${className}`}>
      {items.map((item) => (
        <li key={item.id} data-tone={item.tone ?? 'neutral'}>
          <span className="aig-timeline-dot" aria-hidden="true" />
          <div>
            {item.time && <time dateTime={item.dateTime}>{item.time}</time>}
            <strong>{item.title}</strong>
            {item.description && <div>{item.description}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
