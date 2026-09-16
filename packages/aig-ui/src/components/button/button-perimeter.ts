import { useCallback, useEffect, useRef, type RefObject } from 'react';

/** 三段线等距绕行并随速度同步增长；仅在加减速期间逐帧调整速率，避免重启循环造成跳位。 */
export function useButtonPerimeter(frameRef: RefObject<HTMLSpanElement | null>, disabled: boolean) {
  const changeRate = useRef<(active: boolean) => void>(() => undefined);
  useEffect(() => {
    const frame = frameRef.current;
    const button = frame?.closest('button');
    if (!frame || !button) return;
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
      // 25 倍速时三段各占周长的三分之一，有限时间内闭合，之后继续加速。
      const progress = Math.min(1, Math.max(0, (value - 1) / 24));
      const heat = progress * progress * (3 - 2 * progress);
      button.style.setProperty('--aig-perimeter-heat', String(heat));
      button.style.setProperty('--aig-perimeter-length', String(3 + (100 / 3 - 3) * heat));
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
      button.style.removeProperty('--aig-perimeter-heat');
      button.style.removeProperty('--aig-perimeter-length');
      media?.removeEventListener('change', reset);
      changeRate.current = () => undefined;
    };
  }, [frameRef]);
  useEffect(() => {
    if (disabled) changeRate.current(false);
  }, [disabled]);
  return useCallback((active: boolean) => changeRate.current(active), []);
}
