import { useEffect, useRef, useState } from 'react';
import { LoadingSequence } from './loading-sequence.js';
import { Button } from '../components/button/button.js';
import original from '../../../../reference/404.html?raw';
import './styles.css';
import './loading-sequence.demo.css';

export default { title: '动效/LoadingSequence', component: LoadingSequence };

// 原文件保持原样；对照去除业务脚本，由演示时钟接管退出和移除。
const referenceSource = original.replace(/<script>[\s\S]*?<\/script>/g, '').replace(
  '</head>',
  `<style>
.loader, .stage { animation: none; }
body.is-ready .loader { animation: loaderExit .8s cubic-bezier(.4,0,.2,1) forwards; }
body.is-ready .stage { animation: stageIn 1.15s cubic-bezier(.22,.61,.36,1) forwards; }
.loader-mark { width: var(--aig-demo-mark-size, 93.6px); height: var(--aig-demo-mark-size, 93.6px); }
</style></head>`,
);

/** 本地演示信号与调试控制；实际应用使用真实任务状态。 */
export function Interactive() {
  const [task, setTask] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [exits, setExits] = useState(0);
  const [rate, setRate] = useState(1);
  const [paused, setPaused] = useState(false);
  const [reference, setReference] = useState(false);
  const [autoReady, setAutoReady] = useState<number | undefined>(2400);
  const [editing, setEditing] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const elapsed = useRef(0);
  const controls = useRef({ rate, paused, autoReady, status });
  controls.current = { rate, paused, autoReady, status };

  useEffect(() => {
    elapsed.current = 0;
    let previous = performance.now();
    let request = 0;
    const held = new WeakSet<Animation>();
    const apply = (now: number) => {
      const { rate, paused, autoReady, status } = controls.current;
      if (!paused) elapsed.current += (now - previous) * rate;
      previous = now;
      const document = frame.current?.contentDocument;
      document?.documentElement?.style.setProperty(
        '--aig-demo-mark-size',
        `${Math.max(88, Math.min(118, innerHeight * 0.13))}px`,
      );
      const animations = document?.getAnimations() ?? host.current?.getAnimations({ subtree: true }) ?? [];
      animations.forEach((animation) => {
        if (animation.playbackRate !== rate) animation.updatePlaybackRate(rate);
        if (paused && animation.playState === 'running') {
          held.add(animation);
          animation.pause();
        }
        if (!paused && held.has(animation)) {
          held.delete(animation);
          animation.play();
        }
      });
      if (status === 'loading' && autoReady !== undefined && elapsed.current >= autoReady) setStatus('ready');
      if (document?.body && status === 'ready' && !document.body.classList.contains('is-ready')) {
        document.body.classList.add('is-ready');
        const loader = document.querySelector('.loader');
        loader?.classList.add('is-exiting');
        Promise.all(
          loader
            ?.getAnimations({ subtree: true })
            .filter((a) => a.effect?.getTiming().iterations !== Infinity)
            .map((a) => a.finished) ?? [],
        )
          .then(() => loader?.remove())
          .catch(() => {});
      }
      request = requestAnimationFrame(apply);
    };
    request = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(request);
  }, [task, reference]);

  function replay() {
    setTask(task + 1);
    setStatus('loading');
    setEditing(false);
    setPaused(false);
  }

  return (
    <div className="aig-sequence-demo" data-aig-theme="warm">
      <div className="aig-sequence-demo-heading">
        <span>线条建立 · 协同等待 · 反向消散</span>
        <span>完成交接 {exits} 次</span>
      </div>
      <div className="aig-sequence-demo-stage">
        {reference ? (
          <iframe
            ref={frame}
            key={task}
            title="原始加载动画参考"
            srcDoc={referenceSource}
            sandbox="allow-same-origin"
          />
        ) : (
          <div ref={host}>
            <LoadingSequence
              taskId={String(task)}
              status={status}
              minimumVisibleMs={0}
              label="AIG UI"
              description="工作空间正在准备"
              onExited={() => setExits((value) => value + 1)}
            >
              <div className="aig-sequence-demo-ready">
                <span className="aig-sequence-demo-kicker">READY TO CREATE</span>
                <h3>让工作，从容开始。</h3>
                <p>{editing ? '演示编辑已开始。' : '工作空间已就绪，你可以继续当前任务。'}</p>
                <Button variant="outline" onClick={() => setEditing(true)}>
                  开始编辑
                </Button>
              </div>
            </LoadingSequence>
          </div>
        )}
      </div>
      <div className="aig-sequence-demo-toolbar">
        <div className="aig-sequence-demo-actions">
          <Button variant="outline" size="sm" onClick={replay}>
            重试
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setPaused(!paused)}>
            {paused ? '继续' : '暂停'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setStatus('ready')}>
            任务就绪
          </Button>
          <Button variant="ghost" size="sm" disabled={reference} onClick={() => setStatus('error')}>
            模拟失败
          </Button>
        </div>
        <div className="aig-sequence-demo-options">
          <label>
            速度{' '}
            <select value={rate} onChange={(event) => setRate(Number(event.target.value))}>
              <option value={1}>1 倍</option>
              <option value={0.5}>0.5 倍</option>
              <option value={0.25}>0.25 倍</option>
            </select>
          </label>
          <label>
            就绪时机{' '}
            <select
              value={autoReady ?? 'manual'}
              onChange={(event) => {
                setAutoReady(event.target.value === 'manual' ? undefined : Number(event.target.value));
                replay();
              }}
            >
              <option value="manual">持续等待</option>
              {[0, 200, 1000, 2400, 10000].map((value) => (
                <option key={value} value={value}>
                  {value} ms
                </option>
              ))}
            </select>
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setReference(!reference);
              replay();
            }}
          >
            {reference ? '精修版本' : '原版对照'}
          </Button>
        </div>
      </div>
    </div>
  );
}
