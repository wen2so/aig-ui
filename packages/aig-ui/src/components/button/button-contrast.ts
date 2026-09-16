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
    const svgNamespace = 'http://www.w3.org/2000/svg';
    const definitions = document.createElementNS(svgNamespace, 'svg');
    definitions.setAttribute('width', '0');
    definitions.setAttribute('height', '0');
    definitions.setAttribute('aria-hidden', 'true');
    definitions.style.position = 'absolute';
    definitions.style.pointerEvents = 'none';
    const mask = document.createElementNS(svgNamespace, 'mask');
    mask.id = `aig-button-text-mask-${suffix}`;
    mask.classList.add('aig-button-text-mask');
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    mask.setAttribute('maskContentUnits', 'userSpaceOnUse');
    mask.setAttribute('x', '0');
    mask.setAttribute('y', '0');
    mask.style.maskType = 'alpha';
    definitions.append(mask);
    button.append(definitions);
    contrast.style.maskImage = `url("#${mask.id}")`;
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
      // 浅色细线共享文字遮罩，复用挂载时确定的随机布局。
      const lineFrame = button.querySelector('.aig-button-frame')?.cloneNode(true) as
        HTMLSpanElement | undefined;
      if (lineFrame) {
        lineFrame.className = 'aig-button-contrast-frame';
        contrast.replaceChildren(copy, lineFrame);
      } else contrast.replaceChildren(copy);
    };
    const update = () => {
      frame = 0;
      const active =
        !button.disabled &&
        (highlight.hasAttribute('data-hovered') ||
          highlight.hasAttribute('data-playing') ||
          button.getAttribute('aria-pressed') === 'true' ||
          button.getAttribute('aria-expanded') === 'true');
      const layer = contrast.getBoundingClientRect();
      const bounds = highlight.getBoundingClientRect();
      mask.setAttribute('width', String(layer.width));
      mask.setAttribute('height', String(layer.height));
      const facets = [...highlight.querySelectorAll('polygon')];
      while (mask.childElementCount > facets.length) mask.lastElementChild!.remove();
      while (mask.childElementCount < facets.length) {
        const path = document.createElementNS(svgNamespace, 'path');
        path.setAttribute('fill', 'white');
        path.setAttribute('stroke', 'white');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('stroke-linejoin', 'bevel');
        mask.append(path);
      }
      facets.forEach((polygon, index) => {
        const style = getComputedStyle(polygon);
        const depth = Number(style.getPropertyValue('--aig-facet-depth')) || 1;
        // 按本块的实际显示比例混合深浅字，渐显初期保留足够的深色文字。
        const alpha = active ? Math.min(1, Math.max(0, Number(style.fillOpacity) / depth)) : 0;
        const points = [...polygon.points].map(
          (point) =>
            `${(point.x * bounds.width) / 300 + bounds.left - layer.left},${(point.y * bounds.height) / 100 + bounds.top - layer.top}`,
        );
        const path = mask.children[index]!;
        path.setAttribute('d', `M${points.join(' L')} Z`);
        path.setAttribute('fill-opacity', String(alpha));
        path.setAttribute('stroke-opacity', String(alpha));
      });
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
    motionObserver.observe(button, {
      attributes: true,
      attributeFilter: ['aria-pressed', 'aria-expanded', 'disabled'],
    });
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    resizeObserver?.observe(button);
    resizeObserver?.observe(highlight);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      contentObserver.disconnect();
      motionObserver.disconnect();
      resizeObserver?.disconnect();
      definitions.remove();
      contrast.style.removeProperty('mask-image');
    };
  }, [highlightRef, contentRef, contrastRef, suffix]);
}
