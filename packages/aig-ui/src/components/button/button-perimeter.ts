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
      animations().forEach((animation) => {
        animation.playbackRate = value;
      });
    };
    changeRate.current = (active) => {
      cancelAnimationFrame(raf);
      if (media?.matches) return;
      const from = rate;
      const to = active && !button.disabled ? 3 : 1;
      if (from === to) return;
      const started = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - started) / 900);
        // 平滑起停；中途离开时从当前速率减速，不重置动画位置。
        const eased = progress * progress * (3 - 2 * progress);
        setRate(from + (to - from) * eased);
        if (progress < 1) raf = requestAnimationFrame(step);
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
      media?.removeEventListener('change', reset);
      changeRate.current = () => undefined;
    };
  }, [frameRef]);
  useEffect(() => {
    if (disabled) changeRate.current(false);
  }, [disabled]);
  return useCallback((active: boolean) => changeRate.current(active), []);
}
