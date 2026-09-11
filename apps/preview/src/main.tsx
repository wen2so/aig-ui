import { useState, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '../../../packages/aig-ui/src/components/button/button.js';
import { LoadingMark } from '../../../packages/aig-ui/src/motion/loading-mark.js';
import { Interactive as SequenceDemo } from '../../../packages/aig-ui/src/motion/loading-sequence.stories.js';
import '../../../packages/aig-ui/src/styles.css';
import '../../../packages/aig-ui/src/motion/styles.css';
import '../../../packages/aig-ui/src/ai/styles.css';
import './preview.css';
import { componentStories } from './catalog.js';

function MarkDemo() {
  const [phase, setPhase] = useState<'drawing' | 'holding' | 'erasing' | 'static'>('drawing');
  const [run, setRun] = useState(0);
  return <><div className="preview-stage"><LoadingMark key={run} phase={phase} label="加载标记" /></div><div className="preview-actions"><Button onClick={() => { setRun(run + 1); setPhase('drawing'); }}>重新绘制</Button><Button variant="outline" onClick={() => setPhase('erasing')}>撤回描边</Button><Button variant="ghost" onClick={() => setPhase('static')}>静态</Button></div></>;
}

const entries = [
  { name: 'Button', label: '按钮', group: '基础', description: '五种操作层级，保留原生键盘和表单行为。', render: () => <div className="preview-actions">{(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((variant, i) => <Button key={variant} variant={variant} onClick={event => { event.currentTarget.textContent = '操作已完成'; }}>{['主操作', '次操作', '描边按钮', '文字按钮', '危险操作'][i]}</Button>)}<Button loading>正在保存</Button><Button disabled>暂不可用</Button></div> },
  { name: 'LoadingMark', label: '加载标记', group: '动效', description: 'SVG 逐步建立，双环协同等待，从当前进度反向撤回。', render: () => <MarkDemo /> },
  { name: 'LoadingSequence', label: '加载序列', group: '动效', description: '任务就绪后反向擦除、解构并交接内容，支持失败恢复。', render: () => <SequenceDemo /> },
  ...Object.values(componentStories).filter(story => story.preview && story.Preview).map(story => ({ ...story.preview, group: '通用', render: () => <story.Preview /> })),
];

function Preview() {
  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get('component') ?? '');
  const visible = entries.filter(entry => `${entry.name}${entry.label}${entry.group}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="preview-shell" data-aig-theme="warm"><aside className="preview-sidebar"><a className="preview-brand" href="#top">aig<span>—</span>ui</a><p>组件与交互</p><label htmlFor="search">查找组件</label><input id="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="名称或用途" /><nav aria-label="组件目录">{visible.map(entry => <a key={entry.name} href={`#${entry.name}`}><span>{entry.label}</span><small>{entry.name}</small></a>)}</nav><a className="preview-docs" href="http://localhost:6006">打开 Storybook ↗</a></aside><main id="top"><header className="preview-header"><span className="preview-eyebrow">AIG UI / COMPONENT LIBRARY</span><h1>平静的界面，清晰的交互。</h1><p>暖白、柔和材质与精密动效。探索组件的外观、状态和实际操作。</p><span className="preview-count">{entries.length} 个已实现组件 · 实验性 Alpha</span></header>{visible.map(entry => <section key={entry.name} id={entry.name} className="preview-section"><div className="preview-section-heading"><div><small>{entry.group}</small><h2>{entry.label} <span>{entry.name}</span></h2></div><code>可交互预览</code></div><p>{entry.description}</p><div className="preview-example">{entry.render()}</div></section>)}{visible.length === 0 && <p role="status">当前没有匹配的组件。</p>}</main></div>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><Preview /></StrictMode>);
