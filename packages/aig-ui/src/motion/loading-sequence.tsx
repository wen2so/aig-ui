'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { useAigPortalContainer } from '../theme/aig-provider.js';
import { LoadingMark } from './loading-mark.js';
import { useReducedMotion } from './use-reduced-motion.js';
import { motionTiming as timing } from '../tokens/motion.js';

/** 由真实任务状态驱动加载与内容交接。 */
export interface LoadingSequenceProps {
  /** 重试和新任务使用新的稳定标识。 */
  taskId: string;
  status: 'loading' | 'ready' | 'error';
  label: string;
  description?: string;
  /** 有限的 0–100 数值，省略或非法时采用未定进度。 */
  progress?: number;
  /** 默认 0；完整品牌入场可设置为 1600。 */
  minimumVisibleMs?: number;
  presentation?: 'inline' | 'fullscreen';
  motion?: 'system' | 'reduced';
  errorContent?: ReactNode;
  actions?: ReactNode;
  /** 本次交接完成时调用一次；初始 ready 直接展示内容。 */
  onExited?: () => void;
  children: ReactNode;
}

/** taskId 变化时销毁旧序列，隔离旧动画和回调。 */
export function LoadingSequence(props: LoadingSequenceProps) {
  return <Sequence key={props.taskId} {...props} />;
}

function Sequence({
  status,
  label,
  description,
  progress,
  minimumVisibleMs = 0,
  presentation = 'inline',
  motion = 'system',
  errorContent,
  actions,
  onExited,
  children,
}: LoadingSequenceProps) {
  const container = useAigPortalContainer();
  const [phase, setPhase] = useState<'loading' | 'error' | 'exiting' | 'complete'>(
    status === 'ready' ? 'complete' : status === 'error' ? 'error' : 'loading',
  );
  const [erased, setErased] = useState(false);
  const [dissolved, setDissolved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const layer = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const started = useRef(0);
  const notified = useRef(false);
  const callback = useRef(onExited);
  callback.current = onExited;
  const reduced = useReducedMotion(motion);
  const validProgress =
    progress !== undefined && Number.isFinite(progress) && progress >= 0 && progress <= 100;
  const masked = phase !== 'complete' && !(phase === 'exiting' && erased && dissolved);

  useEffect(() => {
    started.current = performance.now();
  }, []);
  useEffect(() => {
    if (status === 'error') {
      setPhase('error');
      return;
    }
    if (status === 'loading') {
      setPhase('loading');
      setErased(false);
      setDissolved(false);
      setRevealed(false);
      return;
    }
    if (phase === 'complete') return;
    const minimum = Number.isFinite(minimumVisibleMs) ? Math.max(0, minimumVisibleMs) : 0;
    const remaining = reduced ? 0 : Math.max(0, minimum - (performance.now() - started.current));
    if (remaining === 0) {
      setPhase('exiting');
      return;
    }
    const timer = window.setTimeout(() => setPhase('exiting'), remaining);
    return () => window.clearTimeout(timer);
    // 阶段变化由本次任务信号推进，避免定时器被自身状态更新重建。
  }, [status, reduced, minimumVisibleMs]);

  useEffect(() => {
    if (phase !== 'loading') return;
    if (reduced) {
      [labelRef.current, progressRef.current].forEach((element) => {
        if (element) element.style.opacity = '1';
      });
      return;
    }
    const animations = [labelRef.current, progressRef.current].flatMap((element, index) =>
      element?.animate
        ? [
            element.animate(
              [
                { opacity: 0, transform: 'translateY(7px)' },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              {
                duration: timing['support-duration'],
                delay: index ? timing['progress-delay'] : timing['label-delay'],
                easing: 'cubic-bezier(0.22,0.61,0.36,1)',
                fill: 'both',
              },
            ),
          ]
        : [],
    );
    return () => {
      [labelRef.current, progressRef.current].forEach((element) => {
        if (element) element.style.opacity = getComputedStyle(element).opacity;
      });
      animations.forEach((animation) => animation.cancel());
    };
  }, [phase, reduced]);

  useEffect(() => {
    if (phase !== 'exiting') return;
    let active = true;
    if (reduced || !layer.current?.animate || !content.current?.animate) {
      setErased(true);
      setDissolved(true);
      setRevealed(true);
      return;
    }
    // 子组件已从实际进度启动撤回；用其有限轨道计算交接延迟。
    const eraseDuration = Math.max(
      0,
      ...Array.from(layer.current.querySelectorAll('.aig-loading-mark g *')).flatMap((part) =>
        part
          .getAnimations()
          .map((animation) => Number(animation.effect?.getComputedTiming().endTime))
          .filter(Number.isFinite),
      ),
    );
    const labels = [labelRef.current, progressRef.current, actionsRef.current].flatMap((element) => {
      if (!element) return [];
      const opacity = Number(getComputedStyle(element).opacity);
      if (opacity === 0) return [];
      return [
        element.animate([{ opacity }, { opacity: 0 }], {
          duration: timing['label-exit-duration'],
          fill: 'both',
          easing: 'cubic-bezier(0.4,0,0.2,1)',
        }),
      ];
    });
    const dissolve = layer.current.animate(
      [
        { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)', offset: 0 },
        { opacity: 0.92, transform: 'scale(1.008)', filter: 'blur(.3px)', offset: 0.45 },
        { opacity: 0, transform: 'scale(1.06)', filter: 'blur(10px)', offset: 1 },
      ],
      {
        duration: timing['dissolve-duration'],
        delay: Math.min(timing['dissolve-delay'], eraseDuration),
        easing: 'cubic-bezier(.4,0,.2,1)',
        fill: 'both',
      },
    );
    const reveal = content.current.animate(
      [
        { opacity: 0, transform: 'scale(.975) translateY(14px)' },
        { opacity: 1, transform: 'scale(1) translateY(0)' },
      ],
      {
        duration: timing['reveal-duration'],
        delay: Math.max(eraseDuration, labels.length ? timing['label-exit-duration'] : 0),
        easing: 'cubic-bezier(.22,.61,.36,1)',
        fill: 'both',
      },
    );
    dissolve.finished
      .then(() => {
        if (active) setDissolved(true);
      })
      .catch(() => {});
    reveal.finished
      .then(() => {
        if (active) setRevealed(true);
      })
      .catch(() => {});
    return () => {
      active = false;
      dissolve.cancel();
      reveal.cancel();
      labels.forEach((animation) => animation.cancel());
    };
  }, [phase, reduced]);

  useEffect(() => {
    if (phase === 'exiting' && erased && dissolved && revealed) {
      setPhase('complete');
      if (!notified.current) {
        notified.current = true;
        callback.current?.();
      }
    }
  }, [phase, erased, dissolved, revealed]);

  const overlay = (
    <div ref={layer} className="aig-sequence-layer" data-state={phase}>
      <LoadingMark
        phase={phase === 'error' ? 'static' : phase === 'exiting' ? 'erasing' : 'drawing'}
        motion={motion}
        onErased={() => setErased(true)}
      />
      <div ref={labelRef} className="aig-sequence-label">
        <strong>{phase === 'exiting' ? '内容已就绪' : label}</strong>
        {description && <span>{description}</span>}
      </div>
      {phase === 'error' ? (
        <div role="alert">{errorContent ?? '加载未完成，请重试。'}</div>
      ) : (
        <div
          ref={progressRef}
          className="aig-sequence-progress"
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={validProgress ? progress : undefined}
        >
          <span
            data-known={validProgress || undefined}
            style={validProgress ? { width: `${progress}%` } : undefined}
          />
        </div>
      )}
      {actions && (
        <div ref={actionsRef} className="aig-sequence-actions">
          {actions}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="aig-loading-sequence"
      data-aig-component="loading-sequence"
      data-phase={phase}
      data-reduced={reduced || undefined}
    >
      <span className="aig-sr-only" role="status">
        {phase === 'complete' || phase === 'exiting'
          ? '内容已就绪'
          : status === 'error'
            ? '加载未完成'
            : label}
      </span>
      <div
        ref={content}
        className="aig-sequence-content"
        aria-busy={masked}
        inert={masked}
        style={{ opacity: phase === 'complete' || phase === 'exiting' ? 1 : 0 }}
      >
        {children}
      </div>
      {presentation === 'inline' ? (
        masked && overlay
      ) : (
        <Dialog.Root open={masked} disablePointerDismissal onOpenChange={(_, details) => details.cancel()}>
          <Dialog.Portal container={container}>
            <Dialog.Popup className="aig-sequence-fullscreen" aria-label={label}>
              {overlay}
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
}
