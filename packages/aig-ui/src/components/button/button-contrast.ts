import { useEffect, useId, type RefObject } from 'react';

/** 复用已渲染的内容作为纯视觉浅字层，按实际可见刻面裁切，保持单一可访问名称。 */
export function useButtonContrast(
  highlightRef: RefObject<SVGSVGElement | null>,
  contentRef: RefObject<HTMLSpanElement | null>,
  contrastRef: RefObject<HTMLSpanElement | null>,
) {
  const suffix = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  useEffect(() => {
    const highlight = highlightRef.current;
    const source = contentRef.current;
    const contrast = contrastRef.current;
    const button = highlight?.closest('button');
    if (!highlight || !source || !contrast || !button) return;
    let frame = 0;
    const copyContent = () => {
      const copy = source.cloneNode(true) as HTMLSpanElement;
      copy.className = 'aig-button-contrast-content';
      // 保留自定义图标内部引用，同时让视觉副本拥有独立 ID。
      const ids = new Map<string, string>();
      copy.querySelectorAll('[id]').forEach((node) => {
        const id = node.id;
        ids.set(id, `${id}-${suffix}`);
        node.id = ids.get(id)!;
      });
      copy.querySelectorAll('*').forEach((node) => {
        for (const attribute of [...node.attributes]) {
          let value = attribute.value;
          ids.forEach((next, previous) => {
            value = value.replaceAll(`url(#${previous})`, `url(#${next})`);
            if (value === `#${previous}`) value = `#${next}`;
          });
          if (value !== attribute.value) node.setAttribute(attribute.name, value);
        }
      });
      contrast.replaceChildren(copy);
    };
    const update = () => {
      frame = 0;
      let path = '';
      const active = !button.disabled && highlight.hasAttribute('data-hovered');
      if (active) {
        const layer = contrast.getBoundingClientRect();
        const bounds = highlight.getBoundingClientRect();
        highlight.querySelectorAll('polygon').forEach((polygon) => {
          if (Number(getComputedStyle(polygon).fillOpacity) === 0) return;
          const points = [...polygon.points].map(
            (point) =>
              `${(point.x * bounds.width) / 300 + bounds.left - layer.left},${(point.y * bounds.height) / 100 + bounds.top - layer.top}`,
          );
          path += `M${points.join(' L')} Z `;
        });
      }
      contrast.style.clipPath = path ? `path('${path}')` : 'inset(50%)';
      // 只在刻面或外沿仍运动时跟随实际帧，稳定后由状态、内容和尺寸变化唤醒。
      if (
        active &&
        highlight.getAnimations({ subtree: true }).some((animation) => animation.playState === 'running')
      ) {
        frame = requestAnimationFrame(update);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    copyContent();
    const contentObserver = new MutationObserver(() => {
      copyContent();
      schedule();
    });
    contentObserver.observe(source, {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true,
    });
    const motionObserver = new MutationObserver(schedule);
    motionObserver.observe(highlight, { attributes: true, childList: true, subtree: true });
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    resizeObserver?.observe(button);
    resizeObserver?.observe(highlight);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      contentObserver.disconnect();
      motionObserver.disconnect();
      resizeObserver?.disconnect();
    };
  }, [highlightRef, contentRef, contrastRef, suffix]);
}
