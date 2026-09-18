'use client';
import { useState, type ComponentPropsWithRef, type ReactNode } from 'react';
export interface AvatarProps extends ComponentPropsWithRef<'span'> {
  name: string;
  src?: string;
  size?: number;
  fallback?: ReactNode;
}
/** 图片加载失败时回退到文字，名称始终提供可访问描述。 */
export function Avatar({ name, src, size = 36, fallback, className = '', style, ...props }: AvatarProps) {
  const [failed, setFailed] = useState<string>();
  return (
    <span
      {...props}
      role="img"
      aria-label={name}
      className={`aig-avatar ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      {src && failed !== src ? (
        <img src={src} alt="" onError={() => setFailed(src)} />
      ) : (
        (fallback ?? name.trim().slice(0, 2))
      )}
    </span>
  );
}
