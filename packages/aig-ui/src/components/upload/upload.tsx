'use client';
import { useEffect, useId, useRef, useState, type ComponentPropsWithRef } from 'react';
import { Button } from '../button/button.js';
import { Progress } from '../progress/progress.js';
export interface UploadItem {
  id: string;
  file: File;
  status: 'ready' | 'uploading' | 'done' | 'error' | 'cancelled';
  progress: number;
  error?: string;
}
export interface UploadContext {
  signal: AbortSignal;
  onProgress: (percent: number) => void;
}
export interface UploadProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange'> {
  label?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** 文件大小上限，单位字节。 */ maxSize?: number;
  maxCount?: number;
  onUpload?: (file: File, context: UploadContext) => Promise<void>;
  onFilesChange?: (files: UploadItem[]) => void;
}
/** 校验同时作用于选择和拖放；每次上传独立取消，迟到回调不得复活已移除条目。 */
export function Upload({
  label = '选择或拖入文件',
  accept,
  multiple = false,
  disabled = false,
  maxSize = Infinity,
  maxCount = Infinity,
  onUpload,
  onFilesChange,
  className = '',
  ...props
}: UploadProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const current = useRef<UploadItem[]>([]);
  const controllers = useRef(new Map<string, AbortController>());
  const changeRef = useRef(onFilesChange);
  changeRef.current = onFilesChange;
  const id = useId();
  const sequence = useRef(0);
  useEffect(() => {
    const active = controllers.current;
    return () => {
      active.forEach((controller) => controller.abort());
      active.clear();
    };
  }, []);
  const publish = (next: UploadItem[]) => {
    current.current = next;
    setItems(next);
    changeRef.current?.(next);
  };
  const patch = (itemId: string, update: Partial<UploadItem>) =>
    publish(current.current.map((item) => (item.id === itemId ? { ...item, ...update } : item)));
  async function upload(item: UploadItem) {
    if (!onUpload || disabled || controllers.current.has(item.id)) return;
    const controller = new AbortController();
    controllers.current.set(item.id, controller);
    patch(item.id, { status: 'uploading', progress: 0, error: undefined });
    try {
      await onUpload(item.file, {
        signal: controller.signal,
        onProgress: (percent) => {
          if (!controller.signal.aborted && Number.isFinite(percent))
            patch(item.id, { progress: Math.max(0, Math.min(100, percent)) });
        },
      });
      if (!controller.signal.aborted) patch(item.id, { status: 'done', progress: 100 });
    } catch (reason) {
      if (!controller.signal.aborted)
        patch(item.id, {
          status: 'error',
          error: reason instanceof Error ? reason.message : '上传未完成，请重试。',
        });
    } finally {
      if (controllers.current.get(item.id) === controller) controllers.current.delete(item.id);
    }
  }
  function add(files: File[]) {
    if (disabled) return;
    const tokens =
      accept
        ?.split(',')
        .map((token) => token.trim().toLowerCase())
        .filter(Boolean) ?? [];
    const failures: string[] = [];
    const added: UploadItem[] = [];
    for (const file of files) {
      const matches =
        !tokens.length ||
        tokens.some((token) =>
          token.startsWith('.')
            ? file.name.toLowerCase().endsWith(token)
            : token.endsWith('/*')
              ? file.type.toLowerCase().startsWith(token.slice(0, -1))
              : file.type.toLowerCase() === token,
        );
      if (!matches) {
        failures.push(`${file.name}：文件类型不符合要求`);
        continue;
      }
      if (file.size > maxSize) {
        failures.push(`${file.name}：超过大小上限`);
        continue;
      }
      if (current.current.length + added.length >= Math.min(maxCount, multiple ? Infinity : 1)) {
        failures.push(`${file.name}：超过文件数量上限`);
        continue;
      }
      added.push({ id: `${id}-${++sequence.current}`, file, status: 'ready', progress: 0 });
    }
    setError(failures.join('；'));
    if (added.length) {
      publish([...current.current, ...added]);
      added.forEach((item) => void upload(item));
    }
  }
  function cancel(item: UploadItem, remove = false) {
    controllers.current.get(item.id)?.abort();
    controllers.current.delete(item.id);
    if (remove) publish(current.current.filter((entry) => entry.id !== item.id));
    else patch(item.id, { status: 'cancelled' });
  }
  return (
    <div
      {...props}
      className={`aig-upload ${className}`}
      data-dragging={dragging || undefined}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        add(Array.from(event.dataTransfer.files));
      }}
    >
      <div className="aig-upload-dropzone">
        <input
          ref={input}
          type="file"
          hidden
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-label={label}
          onChange={(event) => {
            add(Array.from(event.target.files ?? []));
            event.target.value = '';
          }}
        />
        <Button variant="outline" disabled={disabled} onClick={() => input.current?.click()}>
          {label}
        </Button>
        <p>
          {accept ? `支持 ${accept}` : '选择文件后可查看状态并移除'}
          {Number.isFinite(maxSize) ? ` · 单个文件最多 ${Math.round(maxSize / 1024)} KB` : ''}
        </p>
      </div>
      {error && <p role="alert">{error}</p>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <div>
              <strong>{item.file.name}</strong>
              <span>
                {
                  (
                    {
                      ready: '待上传',
                      uploading: '上传中',
                      done: '已完成',
                      error: '上传失败',
                      cancelled: '已取消',
                    } as const
                  )[item.status]
                }
              </span>
            </div>
            {item.status === 'uploading' && (
              <Progress value={item.progress} label={`${item.file.name}上传进度`} />
            )}
            {item.error && <p role="alert">{item.error}</p>}
            <div className="aig-upload-actions">
              {item.status === 'uploading' ? (
                <Button size="sm" variant="ghost" disabled={disabled} onClick={() => cancel(item)}>
                  取消上传
                </Button>
              ) : onUpload && item.status !== 'done' ? (
                <Button size="sm" variant="outline" disabled={disabled} onClick={() => void upload(item)}>
                  {item.status === 'ready' ? '开始上传' : '重试上传'}
                </Button>
              ) : null}
              <Button
                size="sm"
                variant="ghost"
                disabled={disabled}
                aria-label={`移除${item.file.name}`}
                onClick={() => cancel(item, true)}
              >
                移除
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
