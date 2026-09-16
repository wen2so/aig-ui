import { useCallback, useEffect, useRef, type RefObject } from 'react';

/** 随机线长在挂载期间固定；仅在加减速期间逐帧调整速率，避免重启循环造成跳位。 */
export function useButtonPerimeter(frameRef: RefObject<HTMLSpanElement | null>, disabled: boolean) {
  const changeRate = useRef<(active: boolean) => void>(() => undefined);
  useEffect(() => {
    const frame = frameRef.current;
    const button = frame?.closest('button');
    if (!frame || !button) return;
    frame.querySelectorAll<SVGRectElement>('.aig-button-line').forEach((line) => {
      if (line.style.strokeDasharray) return;
      // 归一化周长的 1.2%–4.2%，每段独立取样，短线之间始终留有间隔。
      const length = 1.2 + Math.random() * 3;
      line.style.strokeDasharray = `${length} ${100 - length}`;
    });
    let raf = 0;
    let rate = 1;
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const animations = () =>
      (button.getAnimations?.({ subtree: true }) ?? []).filter(
        (animation) => 'animationName' in animation && animation.animationName === 'aig-button-perimeter',
      );
    const setRate = (value: number) => {
      rate = value;
      // 亮度与光晕随实际速率连续增强，视觉强度渐近饱和，速度仍可持续增长。
      button.style.setProperty('--aig-perimeter-energy', String(1 - Math.exp(-(value - 1) / 12)));
      animations().forEach((animation) => {
        animation.playbackRate = value;
      });
    };
    changeRate.current = (active) => {
      cancelAnimationFrame(raf);
      if (media?.matches) return;
      const from = rate;
      const accelerating = active && !button.disabled;
      if (!accelerating && from === 1) return;
      const started = performance.now();
      const step = (now: number) => {
        const elapsed = Math.max(0, (now - started) / 1000);
        if (accelerating) {
          // 加速度从零平滑趋近每秒增加 4 倍速，速度随停留时间持续增长，不设上限。
          // 不写入 Infinity，保证浏览器始终接收有限速率并保留当前运动位置。
          setRate(from + 4 * (elapsed - 0.9 * (1 - Math.exp(-elapsed / 0.9))));
          raf = requestAnimationFrame(step);
        } else {
          const progress = Math.min(1, elapsed / 0.9);
          const eased = progress * progress * (3 - 2 * progress);
          setRate(from + (1 - from) * eased);
          if (progress < 1) raf = requestAnimationFrame(step);
        }
      };
      raf = requestAnimationFrame(step);
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      setRate(1);
    };
    media?.addEventListener('change', reset);
    return () => {
      reset();
      button.style.removeProperty('--aig-perimeter-energy');
      media?.removeEventListener('change', reset);
      changeRate.current = () => undefined;
    };
  }, [frameRef]);
  useEffect(() => {
    if (disabled) changeRate.current(false);
  }, [disabled]);
  return useCallback((active: boolean) => changeRate.current(active), []);
}
