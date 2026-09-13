import { useId, useState } from 'react';
import { Navigation } from './navigation.js';
export default { title: '通用/Navigation', component: Navigation };
export const preview = {
  name: 'Navigation',
  label: '导航',
  description: '原生导航与可组合链接，标记当前页面并支持长文本换行。',
};
/** 原生锚点定位真实内容，当前标记随点击更新。 */
export function Preview() {
  const id = useId();
  const [current, setCurrent] = useState('project');
  const sections = [
    { value: 'project', label: '项目', content: '设计资料已整理，可以继续审阅。' },
    { value: 'activity', label: '最近动态', content: '今天更新了两份设计记录。' },
    { value: 'members', label: '团队成员', content: '项目成员可查看资料并补充意见。' },
  ];
  return (
    <div style={{ display: 'grid', gap: 20, minWidth: 0 }}>
      <Navigation aria-label="工作空间导航">
        {sections.map(({ value, label }) => (
          <Navigation.Item
            key={value}
            href={`#${id}-${value}`}
            current={current === value}
            onClick={(event) => {
              if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey)
                setCurrent(value);
            }}
          >
            {label}
          </Navigation.Item>
        ))}
      </Navigation>
      {sections.map(({ value, label, content }) => (
        <section key={value} id={`${id}-${value}`} aria-label={label}>
          <h3>{label}</h3>
          <p>{content}</p>
        </section>
      ))}
    </div>
  );
}
