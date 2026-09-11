import { useEffect, useRef, useState } from 'react';
import { LoadingSequence } from './loading-sequence.js';
import { Button } from '../components/button/button.js';
import './styles.css';
import original from '../../../../reference/404.html?raw';

export default { title: '动效/LoadingSequence', component: LoadingSequence };
/** 本地演示信号，应用接入时替换为真实任务状态。 */
export function Interactive() {
  const [task, setTask] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [exits, setExits] = useState(0);
  const [rate, setRate] = useState(1);
  const [paused, setPaused] = useState(false);
  const [reference, setReference] = useState(false);
  const [autoReady, setAutoReady] = useState<number | undefined>();
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const apply = () => host.current?.getAnimations({ subtree: true }).forEach(animation => { animation.updatePlaybackRate(rate); if (paused) animation.pause(); else animation.play(); });
    apply();
    const observer = new MutationObserver(apply);
    if (host.current) observer.observe(host.current, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-phase'] });
    return () => observer.disconnect();
  }, [rate, paused, task, status]);
  useEffect(() => {
    if (autoReady === undefined) return;
    const timer = window.setTimeout(() => setStatus('ready'), autoReady);
    return () => window.clearTimeout(timer);
  }, [task, autoReady]);
  return <div data-aig-theme="warm"><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}><Button onClick={() => setStatus('ready')}>任务就绪</Button><Button variant="outline" onClick={() => setStatus('error')}>模拟失败</Button><Button variant="outline" onClick={() => { setTask(task + 1); setStatus('loading'); }}>重试</Button><Button variant="ghost" onClick={() => setPaused(!paused)}>{paused ? '继续' : '暂停'}</Button><label>速度 <select value={rate} onChange={event => setRate(Number(event.target.value))}><option value={1}>1 倍</option><option value={.5}>0.5 倍</option><option value={.25}>0.25 倍</option></select></label><label>就绪时机 <select value={autoReady ?? 'manual'} onChange={event => { setAutoReady(event.target.value === 'manual' ? undefined : Number(event.target.value)); setTask(task + 1); setStatus('loading'); }}><option value="manual">持续等待</option>{[0, 200, 1000, 2400, 10000].map(value => <option key={value} value={value}>{value} ms</option>)}</select></label><Button variant="ghost" onClick={() => setReference(!reference)}>{reference ? '精修版本' : '原版对照'}</Button><span>完成交接 {exits} 次</span></div>{reference ? <iframe key={task} title="原始加载动画参考" srcDoc={original} sandbox="allow-scripts" style={{ width: '100%', height: 480, border: 0 }} /> : <div ref={host}><LoadingSequence taskId={String(task)} status={status} label="正在打开工作空间" description="本地演示任务" onExited={() => setExits(value => value + 1)} actions={<Button variant="ghost" onClick={() => setStatus('ready')}>取消等待</Button>}><div style={{ minHeight: 320, padding: 32 }}><h3>工作空间已就绪</h3><p>内容接续完成后可以继续操作。</p><Button>开始编辑</Button></div></LoadingSequence></div>}</div>;
}
