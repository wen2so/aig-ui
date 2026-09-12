import type { ComponentPropsWithRef, ReactNode } from 'react';
import { SafeMarkdown } from '../safe-markdown.js';
/** 消息内容是累积文本；流式状态由宿主提供。 */
export interface MessageProps extends Omit<ComponentPropsWithRef<'article'>, 'children'> {
  role: 'user' | 'assistant';
  content: string;
  format?: 'text' | 'markdown';
  status?: 'complete' | 'streaming' | 'failed' | 'cancelled';
  actions?: ReactNode;
  allowRemoteImages?: boolean;
}
/** 状态按消息阶段表达，正文更新保持普通阅读语义。 */
export function Message({
  role: author,
  content,
  format = 'text',
  status = 'complete',
  actions,
  allowRemoteImages,
  className = '',
  ...props
}: MessageProps) {
  return (
    <article
      {...props}
      aria-label={author === 'user' ? '用户消息' : '助手消息'}
      data-author={author}
      data-state={status}
      className={`aig-message ${className}`}
    >
      <header>
        {author === 'user' ? '你' : '助手'}
        {status !== 'complete' && (
          <span>{status === 'streaming' ? '正在生成' : status === 'failed' ? '生成未完成' : '已停止'}</span>
        )}
      </header>
      <div className="aig-message-content">
        {format === 'markdown' ? (
          <SafeMarkdown allowRemoteImages={allowRemoteImages}>{content}</SafeMarkdown>
        ) : (
          <div className="aig-message-text">{content}</div>
        )}
      </div>
      {actions && <footer>{actions}</footer>}
    </article>
  );
}
