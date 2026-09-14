import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);

/** jsdom 补齐本项目使用的 SVG 点列表读取，按实际 points 属性解析。 */
if (typeof SVGElement !== 'undefined' && !('points' in SVGElement.prototype)) {
  Object.defineProperty(SVGElement.prototype, 'points', {
    configurable: true,
    get() {
      const values = (this.getAttribute('points') ?? '')
        .trim()
        .split(/[\s,]+/)
        .map(Number);
      return Array.from({ length: Math.floor(values.length / 2) }, (_, index) => ({
        x: values[index * 2],
        y: values[index * 2 + 1],
      }));
    },
  });
}
