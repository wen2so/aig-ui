import { VisualStudy } from './visual-study.js';
import { useEffect, useRef, useState } from 'react';
import { AccessStatePage } from '../../../registry/blocks/access-state-page/access-state-page.js';
import { SettingsForm } from '../../../registry/blocks/settings-form/settings-form.js';
import { FilterableList } from '../../../registry/blocks/filterable-list/filterable-list.js';
import { AiAssistant, type ChatMessage } from '../../../registry/blocks/ai-assistant/ai-assistant.js';
import type { TaskState } from '../../../packages/aig-ui/src/ai/task-status/task-status.js';
import { ArtifactReview } from '../../../registry/blocks/artifact-review/artifact-review.js';

export const pageEntries = [
  {
    name: 'visual-study',
    label: '视觉样板',
    group: '页面组合',
    description: '留白、表单操作、确认浮层与完整加载交接。',
    render: () => <VisualStudy />,
  },
  {
    name: 'access-state-page',
    label: '访问状态页',
    group: '页面组合',
    description: '根据真实访问状态组合结果、请求信息与恢复入口。',
    render: () => <AccessDemo />,
  },
  {
    name: 'settings-form',
    label: '设置表单',
    group: '页面组合',
    description: '编辑、字段校验、保存失败和草稿保留。本地演示数据。',
    render: () => <SettingsDemo />,
  },
  {
    name: 'filterable-list',
    label: '筛选列表',
    group: '页面组合',
    description: '筛选、分页、空状态、读取错误与详情抽屉。本地演示数据。',
    render: () => <ListDemo />,
  },
  {
    name: 'ai-assistant',
    label: 'AI 助手页面',
    group: '页面组合',
    description: '本地模拟消息分段、停止、失败重试与来源展示。',
    render: () => <AssistantDemo />,
  },
  {
    name: 'artifact-review',
    label: '产物审核页',
    group: '页面组合',
    description: '预览编辑、明确确认、执行失败与版本冲突。本地演示数据。',
    render: () => <ReviewDemo />,
  },
];

function SettingsDemo() {
  const [fail, setFail] = useState(true);
  return (
    <>
      <label>
        <input type="checkbox" checked={fail} onChange={(event) => setFail(event.target.checked)} />{' '}
        模拟保存失败
      </label>
      <SettingsForm
        initialValues={{
          name: '演示项目',
          description: '用于预览组件组合。',
          visibility: 'team',
          notifications: true,
        }}
        onSave={async () => {
          if (fail) throw Error('演示保存失败，修改内容已保留。');
        }}
      />
    </>
  );
}

const listItems = Array.from({ length: 12 }, (_, index) => ({
  id: `demo-${index + 1}`,
  name: `项目资料 ${index + 1}`,
  status: index % 3 ? '已完成' : '待确认',
  description: '本地演示资料，用于验证筛选和详情交互。',
}));
function ListDemo() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('ready');
  const filtered = listItems.filter((item) => item.name.includes(query));
  return (
    <>
      <label>
        演示列表状态{' '}
        <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
          <option value="ready">读取完成</option>
          <option value="loading">加载中</option>
          <option value="error">读取失败</option>
        </select>
      </label>
      <FilterableList
        items={filtered.slice((page - 1) * 5, page * 5)}
        query={query}
        page={page}
        pageCount={Math.ceil(filtered.length / 5)}
        status={status}
        onQueryChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
        onPageChange={setPage}
        onRetry={() => setStatus('ready')}
      />
    </>
  );
}

function AssistantDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('整理演示资料中的重点');
  const [status, setStatus] = useState<TaskState>('idle');
  const [fail, setFail] = useState(false);
  const generation = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  useEffect(
    () => () => {
      clearInterval(timer.current);
      generation.current++;
    },
    [],
  );
  function start(text: string) {
    clearInterval(timer.current);
    const id = ++generation.current;
    const assistantId = `assistant-${id}`;
    setMessages((previous) => [
      ...previous,
      { id: `user-${id}`, role: 'user', content: text },
      { id: assistantId, role: 'assistant', content: '', status: 'streaming' },
    ]);
    setStatus('streaming');
    let cursor = 0;
    const answer =
      '## 演示资料摘要\n\n1. 先核对资料来源与版本。\n2. 保留输入、错误和处理进度。\n3. 用户审阅并确认后再应用结果。\n\n这是固定本地内容，用于验证流式阅读与停止行为。';
    timer.current = setInterval(() => {
      if (generation.current !== id) return;
      cursor += 5;
      const failed = fail && cursor >= 50;
      const done = cursor >= answer.length;
      setMessages((previous) =>
        previous.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content: answer.slice(0, cursor),
                status: failed ? 'failed' : done ? 'complete' : 'streaming',
              }
            : message,
        ),
      );
      if (failed || done) {
        clearInterval(timer.current);
        setStatus(failed ? 'failed' : 'succeeded');
      }
    }, 80);
  }
  function stop() {
    clearInterval(timer.current);
    generation.current++;
    setStatus('cancelled');
    setMessages((previous) =>
      previous.map((message) =>
        message.status === 'streaming' ? { ...message, status: 'cancelled' } : message,
      ),
    );
  }
  return (
    <>
      <label>
        <input type="checkbox" checked={fail} onChange={(event) => setFail(event.target.checked)} />{' '}
        模拟生成中断
      </label>
      <AiAssistant
        messages={messages}
        status={status}
        draft={draft}
        onDraftChange={setDraft}
        onSend={start}
        onStop={stop}
        onRetry={() => start(messages.filter((message) => message.role === 'user').at(-1)?.content ?? draft)}
        sources={
          status === 'succeeded'
            ? [{ id: 'react', title: 'React 官方文档（演示引用）', url: 'https://react.dev' }]
            : []
        }
      />
    </>
  );
}

function ReviewDemo() {
  const [versions, setVersions] = useState([
    { revision: '1', content: '初始项目摘要。' },
    { revision: '2', content: '## 项目摘要\n\n已完成资料核验，等待审阅后应用。' },
  ]);
  const [mode, setMode] = useState<'success' | 'failure' | 'conflict'>('success');
  const [result, setResult] = useState('');
  return (
    <>
      <label>
        演示执行结果{' '}
        <select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}>
          <option value="success">成功</option>
          <option value="failure">失败</option>
          <option value="conflict">版本冲突</option>
        </select>
      </label>
      <ArtifactReview
        artifactId="demo-project"
        versions={versions}
        onSave={async (change) => {
          setVersions((previous) => [
            ...previous,
            { revision: String(previous.length + 1), content: change.content },
          ]);
        }}
        onExecute={async (change) => {
          if (mode === 'failure') throw Error('演示执行失败，请重试。');
          if (mode === 'conflict') {
            setVersions((previous) => [
              ...previous,
              { revision: String(previous.length + 1), content: '其他编辑者更新了项目说明。' },
            ]);
            throw Error('服务端检测到版本冲突。');
          }
          if (change.revision !== versions.at(-1)?.revision) throw Error('当前版本已更新。');
          setResult(`已应用版本 ${change.revision}。`);
        }}
      />
      <p role="status">{result}</p>
    </>
  );
}

function AccessDemo() {
  const [state, setState] = useState<'not-found' | 'session-expired' | 'forbidden'>('session-expired');
  return (
    <>
      <label>
        演示访问状态{' '}
        <select value={state} onChange={(event) => setState(event.target.value as typeof state)}>
          <option value="not-found">页面未找到</option>
          <option value="session-expired">登录已过期</option>
          <option value="forbidden">访问受限</option>
        </select>
      </label>
      <AccessStatePage
        state={state}
        requestId="demo-request-20260912"
        homeHref="/?component=access-state-page"
        loginHref="/?component=access-state-page"
      />
    </>
  );
}
