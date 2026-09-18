'use client';
import { useRef, useState, type ReactElement, type ReactNode } from 'react';
import { Popover } from '../popover/popover.js';
import { Button } from '../button/button.js';
export interface PopconfirmProps {
  trigger: ReactElement;
  title: string;
  description?: ReactNode;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  disabled?: boolean;
  tone?: 'brand' | 'danger';
}
/** 简短确认保留执行中的弹层，失败可重试，锁定期间不能重复提交。 */
export function Popconfirm({
  trigger,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = '确认',
  cancelText = '取消',
  disabled = false,
  tone = 'danger',
}: PopconfirmProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  async function confirm() {
    if (lock.current || disabled) return;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      await onConfirm();
      setOpen(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '操作未完成，请重试。');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <Popover.Root
      open={open}
      onOpenChange={(next, details) => {
        if (lock.current) {
          details.cancel();
          return;
        }
        setOpen(next);
        if (next) setError('');
      }}
    >
      <Popover.Trigger disabled={disabled} render={trigger} />
      <Popover.Content className="aig-popconfirm">
        <Popover.Title>{title}</Popover.Title>
        {description && <Popover.Description>{description}</Popover.Description>}
        {error && <p role="alert">{error}</p>}
        <div className="aig-popconfirm-actions">
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() => {
              setOpen(false);
              onCancel?.();
            }}
          >
            {cancelText}
          </Button>
          <Button tone={tone} loading={busy} onClick={() => void confirm()}>
            {confirmText}
          </Button>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
