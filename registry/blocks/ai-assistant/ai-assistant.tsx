'use client';

import { AigProvider, PageHeader, Button, CopyButton } from 'aig-ui';
import {
  Conversation,
  Message,
  PromptInput,
  SourceList,
  TaskStatus,
  type Source,
  type TaskState,
} from 'aig-ui/ai';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status?: 'complete' | 'streaming' | 'failed' | 'cancelled';
}
export interface AiAssistantProps {
  messages: ChatMessage[];
  status: TaskState;
  draft: string;
  onDraftChange: (draft: string) => void;
  onSend: (draft: string) => void | Promise<void>;
  onStop: () => void;
  onRetry: () => void;
  sources?: Source[];
}

/** 宿主处理模型流、取消和迟到片段；页面提供可控阅读与输入。 */
export function AiAssistant({
  messages,
  status,
  draft,
  onDraftChange,
  onSend,
  onStop,
  onRetry,
  sources = [],
}: AiAssistantProps) {
  const running = status === 'running' || status === 'streaming' || status === 'queued';
  return (
    <AigProvider>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: 24 }}>
        <PageHeader title="AI 助手" description="整理资料、查看来源并审阅结果。" />
        <Conversation
          firstMessageId={messages[0]?.id}
          lastMessageId={messages.at(-1)?.id}
          style={{ height: 360 }}
        >
          {messages.map((message) => (
            <Message
              key={message.id}
              role={message.role}
              content={message.content}
              status={message.status}
              format={message.role === 'assistant' ? 'markdown' : 'text'}
              actions={
                message.role === 'assistant' && message.content ? (
                  <CopyButton size="sm" variant="ghost" value={message.content} label="复制消息" />
                ) : undefined
              }
            />
          ))}
        </Conversation>
        <div style={{ display: 'grid', gap: 20, marginTop: 20 }}>
          <TaskStatus
            status={status}
            actions={
              status === 'failed' || status === 'cancelled' ? (
                <Button size="sm" variant="outline" onClick={onRetry}>
                  重新生成
                </Button>
              ) : undefined
            }
          />
          {sources.length > 0 && <SourceList sources={sources} />}
          <PromptInput
            value={draft}
            onValueChange={onDraftChange}
            onSubmit={onSend}
            running={running}
            onStop={onStop}
          />
        </div>
      </div>
    </AigProvider>
  );
}
