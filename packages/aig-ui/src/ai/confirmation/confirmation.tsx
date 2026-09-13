'use client';
import { useEffect, useRef, useState, type ComponentPropsWithRef } from 'react';
import { Button } from '../../components/button/button.js';
/** 宿主继续校验权限、幂等和实际数据版本。 */
export interface ConfirmationIdentity {
  artifactId: string;
  revision: string;
}
export interface ConfirmationProps
  extends Omit<ComponentPropsWithRef<'section'>, 'title'>, ConfirmationIdentity {
  currentRevision: string;
  target: string;
  summary: string;
  impact: string;
  onConfirm: (identity: ConfirmationIdentity) => void | Promise<void>;
  onReject?: (identity: ConfirmationIdentity) => void;
}
/** 新版本创建新的确认实例，旧请求保持原始 revision。 */
export function Confirmation(props: ConfirmationProps) {
  return <ConfirmationInstance key={JSON.stringify([props.artifactId, props.revision])} {...props} />;
}
function ConfirmationInstance({
  artifactId,
  revision,
  currentRevision,
  target,
  summary,
  impact,
  onConfirm,
  onReject,
  className = '',
  ...props
}: ConfirmationProps) {
  const [state, setState] = useState<'idle' | 'pending' | 'succeeded' | 'rejected' | 'failed'>('idle');
  const [error, setError] = useState('');
  const lock = useRef(false);
  const mounted = useRef(true);
  const current = useRef(currentRevision);
  current.current = currentRevision;
  const stale = revision !== currentRevision;
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  async function confirm() {
    if (lock.current || stale || state === 'succeeded' || state === 'rejected') return;
    lock.current = true;
    setState('pending');
    setError('');
    try {
      await onConfirm({ artifactId, revision });
      if (mounted.current && current.current === revision) setState('succeeded');
    } catch (reason) {
      if (mounted.current) {
        setError(reason instanceof Error ? reason.message : '操作未完成，请重试。');
        setState('failed');
      }
    } finally {
      lock.current = false;
    }
  }
  function reject() {
    if (lock.current || stale) return;
    try {
      onReject?.({ artifactId, revision });
      setState('rejected');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '取消未完成，请重试。');
      setState('failed');
    }
  }
  return (
    <section {...props} data-state={state} className={`aig-confirmation ${className}`}>
      <h3>{target}</h3>
      <p>{summary}</p>
      <p>
        <strong>影响：</strong>
        {impact}
      </p>
      <small>版本 {revision}</small>
      {stale && <p role="alert">内容版本已变化，请重新检查后确认。</p>}
      {error && <p role="alert">{error}</p>}
      <div className="aig-confirmation-actions">
        <Button
          loading={state === 'pending'}
          disabled={stale || state === 'succeeded' || state === 'rejected'}
          onClick={() => void confirm()}
        >
          确认执行
        </Button>
        <Button
          variant="outline"
          disabled={stale || state === 'pending' || state === 'succeeded' || state === 'rejected'}
          onClick={reject}
        >
          拒绝
        </Button>
      </div>
      <p role="status">
        {state === 'succeeded'
          ? '操作已完成'
          : state === 'rejected'
            ? '已拒绝本次操作'
            : state === 'pending'
              ? '正在执行'
              : ''}
      </p>
    </section>
  );
}
