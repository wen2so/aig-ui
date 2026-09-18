'use client';
import { useState } from 'react';
/** 受控值由宿主保存；非受控值只在本地更新，两种模式共享变化回调。 */
export function useControllableValue<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
) {
  const [local, setLocal] = useState(defaultValue);
  return [
    value === undefined ? local : value,
    (next: T) => {
      if (value === undefined) setLocal(next);
      onChange?.(next);
    },
  ] as const;
}
