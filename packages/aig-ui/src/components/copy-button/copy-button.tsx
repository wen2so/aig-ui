'use client';
import { useEffect, useRef, useState } from 'react';
import { Button, type ButtonProps } from '../button/button.js';
/** 写入成功和失败分别回调，label 默认为复制。 */
export interface CopyButtonProps extends Omit<ButtonProps, 'children' | 'onClick'> {
  value: string;
  label?: string;
  onCopySuccess?: () => void;
  onCopyError?: (error: Error) => void;
}
/** 通过 Clipboard API 执行复制并隔离过期结果。 */
export function CopyButton({
  value,
  label = '复制',
  onCopySuccess,
  onCopyError,
  loading,
  ...props
}: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'copying' | 'success' | 'error'>('idle');
  const request = useRef(0);
  const pending = useRef(false);
  useEffect(() => {
    setState('idle');
    pending.current = false;
    return () => {
      request.current++;
      pending.current = false;
    };
  }, [value]);
  async function copy() {
    if (pending.current) return;
    pending.current = true;
    const id = ++request.current;
    setState('copying');
    try {
      if (!navigator.clipboard?.writeText) throw Error('当前环境未提供剪贴板访问');
      await navigator.clipboard.writeText(value);
    } catch (error) {
      if (id === request.current) {
        setState('error');
        pending.current = false;
        onCopyError?.(error instanceof Error ? error : Error(String(error)));
      }
      return;
    }
    if (id === request.current) {
      setState('success');
      pending.current = false;
      onCopySuccess?.();
    }
  }
  return (
    <span className="aig-copy-button" data-state={state}>
      <Button
        {...props}
        loading={loading || state === 'copying'}
        leadingIcon={
          props.leadingIcon ?? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" focusable="false">
              {state === 'success' ? (
                <path className="aig-copy-check" pathLength={1} d="m5 12 4 4L19 6" />
              ) : (
                <>
                  <rect x="8" y="8" width="12" height="13" rx="2" />
                  <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
                </>
              )}
            </svg>
          )
        }
        onClick={copy}
      >
        {label}
      </Button>
      <span role="status">
        {state === 'success' ? '已复制' : state === 'error' ? '复制未完成，请手动复制' : ''}
      </span>
      {state === 'error' && (
        <textarea
          aria-label="待手动复制的原文"
          readOnly
          value={value}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
    </span>
  );
}
