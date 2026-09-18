'use client';
import { useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import { Dialog } from '../dialog/dialog.js';
import { Button } from '../button/button.js';
export interface ImageProps extends ComponentPropsWithRef<'img'> {
  /** 图片必须提供替代说明；装饰图可显式设为空。 */ alt: string;
  preview?: boolean;
  caption?: ReactNode;
  fallback?: ReactNode;
}
/** 加载失败保留替代说明；预览使用已有对话框管理焦点和关闭。 */
export function Image({
  src,
  alt,
  preview = true,
  caption,
  fallback,
  onError,
  className = '',
  ...props
}: ImageProps) {
  const [failed, setFailed] = useState<string>();
  const unavailable = !src || failed === src;
  const picture = unavailable ? (
    <div className="aig-image-fallback" role="img" aria-label={alt}>
      {fallback ?? '图片暂不可用'}
    </div>
  ) : (
    <img
      {...props}
      className={className}
      src={src}
      alt={alt}
      loading={props.loading ?? 'lazy'}
      onError={(event) => {
        setFailed(src);
        onError?.(event);
      }}
    />
  );
  return (
    <figure className="aig-image">
      {preview && !unavailable ? (
        <Dialog.Root>
          <Dialog.Trigger
            render={<button type="button" className="aig-image-trigger" aria-label={`预览：${alt}`} />}
          >
            {picture}
          </Dialog.Trigger>
          <Dialog.Content className="aig-image-dialog">
            <Dialog.Title>{alt || '图片预览'}</Dialog.Title>
            <Dialog.Description>查看图片，按 Escape 或关闭按钮返回。</Dialog.Description>
            <img src={src} alt={alt} />
            <Dialog.Actions>
              <Dialog.Close render={<Button variant="outline" />}>关闭预览</Dialog.Close>
            </Dialog.Actions>
          </Dialog.Content>
        </Dialog.Root>
      ) : (
        picture
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
