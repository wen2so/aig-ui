import { useEffect, useState } from 'react';
import type { Entry, EntryDetail } from './catalog-model.js';
import type { ApiSignature } from '../../../scripts/component-api.mjs';
import apiLoaders from 'virtual:component-api';
type Detail = EntryDetail & { api: ApiSignature[] };
const cache = new Map<string, Promise<Detail>>();
/** 请求与目录项绑定，快速切换时忽略旧资料，失败后允许重试。 */
export function useEntryDetail(entry: Entry | undefined) {
  const [result, setResult] = useState<{ name: string; detail?: Detail; error?: boolean }>();
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!entry) return;
    let active = true;
    let request = cache.get(entry.name);
    if (!request) {
      request = Promise.all([entry.load(), apiLoaders[entry.name]?.()]).then(([detail, api]) => {
        if (!api && entry.group !== '页面组合') throw new Error(`组件 API 缺失：${entry.name}`);
        return { ...detail, api: api?.default ?? [] };
      });
      cache.set(entry.name, request);
    }
    request.then(
      (detail) => {
        if (active) setResult({ name: entry.name, detail });
      },
      () => {
        cache.delete(entry.name);
        if (active) setResult({ name: entry.name, error: true });
      },
    );
    return () => {
      active = false;
    };
  }, [entry, attempt]);
  return {
    detail: result?.name === entry?.name ? result?.detail : undefined,
    error: result?.name === entry?.name && result?.error,
    retry: () => {
      setResult(undefined);
      setAttempt((value) => value + 1);
    },
  };
}
