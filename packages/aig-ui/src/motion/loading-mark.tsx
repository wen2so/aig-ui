'use client';

import { useEffect, useRef, type ComponentPropsWithRef } from 'react';
import { motionTiming as timing } from '../tokens/motion.js';
import { useReducedMotion } from './use-reduced-motion.js';

/** 品牌几何的绘制、等待和撤回。 */
export interface LoadingMarkProps extends ComponentPropsWithRef<'svg'> {
  phase?: 'drawing' | 'holding' | 'erasing' | 'static';
  size?: number | string;
  motion?: 'system' | 'reduced';
  /** 独立使用时提供名称；与状态文本组合时保持装饰语义。 */
  label?: string;
  /** 两条描边都完成撤回后触发。 */
  onErased?: () => void;
}

/** 以原生动画从实际描边位置连续绘制和擦除。 */
export function LoadingMark({
  phase = 'drawing',
  size = 112,
  motion = 'system',
  label,
  onErased,
  className = '',
  ...props
}: LoadingMarkProps) {
  const triangle = useRef<SVGPathElement>(null);
  const bar = useRef<SVGLineElement>(null);
  const callback = useRef(onErased);
  callback.current = onErased;
  const reduced = useReducedMotion(motion);

  useEffect(() => {
    let active = true;
    const animations: Animation[] = [];
    const parts = [triangle.current!, bar.current!];
    parts.forEach((element, index) => {
      const initial = element.style.strokeDashoffset;
      const from =
        phase === 'drawing'
          ? 1
          : phase === 'erasing'
            ? initial === ''
              ? 0
              : Math.max(0, Math.min(1, parseFloat(initial)))
            : 0;
      const to = phase === 'erasing' ? 1 : 0;
      element.style.strokeDashoffset = String(from);
      if (reduced || phase === 'holding' || phase === 'static' || !element.animate) {
        element.style.strokeDashoffset = String(to);
        return;
      }
      const duration =
        phase === 'erasing'
          ? (index ? timing['bar-erase-duration'] : timing['erase-duration']) * (1 - from)
          : index
            ? timing['bar-duration']
            : timing['draw-duration'];
      const animation = element.animate([{ strokeDashoffset: from }, { strokeDashoffset: to }], {
        duration,
        delay: phase === 'drawing' ? (index ? timing['bar-delay'] : timing['draw-delay']) : 0,
        easing: 'cubic-bezier(0.45,0,0.2,1)',
        fill: 'both',
      });
      animations.push(animation);
    });
    Promise.all(animations.map((animation) => animation.finished))
      .then(() => {
        if (!active) return;
        parts.forEach((element) => {
          element.style.strokeDashoffset = phase === 'erasing' ? '1' : '0';
        });
        animations.forEach((animation) => animation.cancel());
        if (phase === 'erasing') callback.current?.();
      })
      .catch(() => {
        /* 任务替换和卸载会正常取消动画。 */
      });
    return () => {
      active = false;
      // 取消前固定当前描边，提前 ready 时从真实位置撤回。
      parts.forEach((element) => {
        element.style.strokeDashoffset = getComputedStyle(element).strokeDashoffset;
      });
      animations.forEach((animation) => animation.cancel());
    };
  }, [phase, reduced]);

  return (
    <svg
      {...props}
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      data-aig-component="loading-mark"
      data-phase={phase}
      data-reduced={reduced || undefined}
      className={`aig-loading-mark ${className}`}
    >
      <circle
        className="aig-ring-outer"
        fill="none"
        cx="100"
        cy="100"
        r="92"
        strokeWidth="1.2"
        strokeDasharray="3 9"
        opacity=".65"
      />
      <circle
        className="aig-ring-inner"
        fill="none"
        cx="100"
        cy="100"
        r="84"
        strokeWidth="1.6"
        strokeDasharray="120 408"
        strokeLinecap="round"
        opacity=".85"
      />
      <path
        ref={triangle}
        fill="none"
        d="M100 38 L164 148 L36 148 Z"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={phase === 'drawing' ? 1 : 0}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <line
        ref={bar}
        fill="none"
        x1="60"
        y1="112"
        x2="140"
        y2="112"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={phase === 'drawing' ? 1 : 0}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
