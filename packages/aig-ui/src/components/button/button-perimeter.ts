import { useCallback, useEffect, useRef, type RefObject } from 'react';

/** 首次交互才创建轨迹；同一文档复用模板，保持三组等距亮头与渐隐尾迹。 */
const templates = new WeakMap<Document, DocumentFragment>();
function ensurePerimeter(frame: HTMLSpanElement) {
  const svg = frame.querySelector('svg');
  if (!svg || svg.childElementCount) return;
  const document = frame.ownerDocument;
  let template = templates.get(document);
  if (!template) {
    template = document.createDocumentFragment();
    const create = (tag: string, className: string) => {
      const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
      element.setAttribute('class', className);
      if (tag === 'rect') element.setAttribute('pathLength', '100');
      return element;
    };
    for (let index = 0; index < 3; index++) {
      const group = create('g', 'aig-button-line');
      for (let sample = 0; sample < 16; sample++) {
        const fraction = (16 - sample) / 16;
        const tail = create('rect', 'aig-button-tail');
        tail.style.strokeDasharray = `0 calc(100 - var(--aig-perimeter-length, 3) * ${fraction}) calc(var(--aig-perimeter-length, 3) * ${fraction}) 0`;
        tail.style.strokeWidth = `${0.15 + (1 - fraction) * 0.35}px`;
        group.append(tail);
      }
      group.append(create('rect', 'aig-button-head'));
      template.append(group);
    }
    template.append(create('rect', 'aig-button-ring'));
    templates.set(document, template);
  }
  svg.append(template.cloneNode(true));
}

/** 三个亮头等距绕行，后方尾迹随速度延展；仅在加减速期间逐帧调整速率，避免重启循环造成跳位。 */
export function useButtonPerimeter(frameRef: RefObject<HTMLSpanElement | null>, disabled: boolean) {
  const changeRate = useRef<(active: boolean) => void>(() => undefined);
  useEffect(() => {
    const frame = frameRef.current;
    const button = frame?.closest('button');
    if (!frame || !button) return;
    let raf = 0;
    let rate = 1;
    let stoppedTime = 0;
    let trailLength = 3;
    let lastSample = performance.now();
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const animations = () =>
      (button.getAnimations?.({ subtree: true }) ?? []).filter(
        (animation) => 'animationName' in animation && animation.animationName === 'aig-button-perimeter',
      );
    // 隐藏子树会销毁 CSS 动画，先保存共享时间，下次显示时同步恢复原线与浅色副本。
    const hide = () => {
      const current = animations()[0]?.currentTime;
      if (typeof current === 'number') stoppedTime = current % 48000;
      button.removeAttribute('data-perimeter-visible');
    };
    const setRate = (value: number) => {
      rate = value;
      // 亮度与光晕随实际速率连续增强，视觉强度渐近饱和，速度仍可持续增长。
      button.style.setProperty('--aig-perimeter-energy', String(1 - Math.exp(-(value - 1) / 12)));
      // 49 倍速时各占周长的三分之一，约持续悬停 8 秒闭合。
      const progress = Math.min(1, Math.max(0, (value - 1) / 48));
      const heat = progress * progress * (3 - 2 * progress);
      button.style.setProperty('--aig-perimeter-heat', String(heat));
      // 尾长追随速度并保留短暂余迹；固定亮头只由位移动画驱动，增长不会把亮头向前推。
      const now = performance.now();
      const elapsed = Math.max(0, now - lastSample);
      lastSample = now;
      const targetLength = 3 + (100 / 3 - 3) * heat;
      trailLength += (targetLength - trailLength) * (1 - Math.exp(-elapsed / 180));
      if (value === 1) trailLength = 3;
      button.style.setProperty('--aig-perimeter-length', String(trailLength));
      // 最后一段尾长增长时淡入完整轮廓，闭合后消除亮头与尾端的明暗循环。
      const fusion = Math.min(1, Math.max(0, (trailLength - 27) / (100 / 3 - 27)));
      button.style.setProperty('--aig-perimeter-fusion', String(fusion > 0.999 ? 1 : fusion));
      animations().forEach((animation) => {
        animation.playbackRate = value;
      });
    };
    changeRate.current = (active) => {
      cancelAnimationFrame(raf);
      const accelerating = active && !button.disabled;
      if (accelerating && !button.hasAttribute('data-perimeter-visible')) {
        ensurePerimeter(frame);
        button.setAttribute('data-perimeter-visible', '');
        animations().forEach((animation) => {
          animation.currentTime = stoppedTime;
          animation.playbackRate = rate;
        });
        lastSample = performance.now();
      }
      if (media?.matches) {
        if (!accelerating) hide();
        return;
      }
      const from = rate;
      if (!accelerating && from === 1) {
        hide();
        return;
      }
      const started = performance.now();
      const step = (now: number) => {
        const elapsed = Math.max(0, (now - started) / 1000);
        if (accelerating) {
          // 加速度从零平滑趋近每秒增加 7 倍速，速度随停留时间持续增长，不设上限。
          // 不写入 Infinity，保证浏览器始终接收有限速率并保留当前运动位置。
          setRate(from + 7 * (elapsed - 0.9 * (1 - Math.exp(-elapsed / 0.9))));
          raf = requestAnimationFrame(step);
        } else {
          // 留出三秒逐渐减速、缩短线段与收回光晕。
          const progress = Math.min(1, elapsed / 3);
          const eased = progress * progress * (3 - 2 * progress);
          setRate(from + (1 - from) * eased);
          if (progress < 1) raf = requestAnimationFrame(step);
          else hide();
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
      button.removeAttribute('data-perimeter-visible');
      button.style.removeProperty('--aig-perimeter-energy');
      button.style.removeProperty('--aig-perimeter-heat');
      button.style.removeProperty('--aig-perimeter-length');
      button.style.removeProperty('--aig-perimeter-fusion');
      media?.removeEventListener('change', reset);
      changeRate.current = () => undefined;
    };
  }, [frameRef]);
  useEffect(() => {
    if (disabled) changeRate.current(false);
  }, [disabled]);
  return useCallback((active: boolean) => changeRate.current(active), []);
}
