'use client';

import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
function subscribe(listener: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}
/** 跟随系统偏好，并保留一致的服务端初始快照。 */
export function useReducedMotion(mode: 'system' | 'reduced' = 'system') {
  const reduced = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
  return mode === 'reduced' || reduced;
}
