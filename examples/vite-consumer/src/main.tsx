import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from 'aig-ui/button';
import { AigProvider, Dialog, Toast, Card } from 'aig-ui';
import { LoadingSequence } from 'aig-ui/motion';
import { Message } from 'aig-ui/ai';
import { pageEntries } from './pages.js';
import 'aig-ui/styles.css';
import 'aig-ui/motion/styles.css';
import 'aig-ui/ai/styles.css';
import './host.css';

function App() {
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const selected = new URLSearchParams(location.search).get('block');
  const entry = pageEntries.find((item) => item.name === selected);
  if (entry)
    return (
      <main>
        <p>Registry 源码与 tarball 消费验证</p>
        {entry.render()}
      </main>
    );
  return (
    <main style={{ padding: 24 }}>
      <h1>aig-ui 消费验证</h1>
      <Button onClick={() => setSaved(true)}>保存设置</Button>
      <p role="status">{saved ? '设置已保存' : '等待操作'}</p>
      <AigProvider
        data-testid="theme"
        material="glass"
        density="compact"
        style={{ '--aig-color-surface': 'rgb(240 246 250)', '--aig-color-accent': 'rgb(38 78 112)' }}
      >
        <Card material="glass">主题与材质共存</Card>
        <Dialog.Root>
          <Dialog.Trigger render={<Button />}>打开主题浮层</Dialog.Trigger>
          <Dialog.Content material="solid">
            <Dialog.Title>主题浮层</Dialog.Title>
            <Dialog.Description>浮层继承当前作用域。</Dialog.Description>
            <Dialog.Close render={<Button />}>关闭</Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
        <Toast.Provider>
          <ToastDemo />
        </Toast.Provider>
        <Button
          onClick={() => {
            setReady(false);
            setFullscreen(true);
          }}
        >
          全屏加载
        </Button>
        <LoadingSequence
          key={String(fullscreen)}
          taskId="consumer"
          status={ready ? 'ready' : 'loading'}
          presentation={fullscreen ? 'fullscreen' : 'inline'}
          label="消费项目加载中"
          actions={<Button onClick={() => setReady(true)}>完成加载</Button>}
        >
          <p>加载已完成</p>
        </LoadingSequence>
      </AigProvider>
      <Message role="assistant" content="**AI 入口**已从独立包载入。" />
      <nav aria-label="页面组合">
        {pageEntries.map((item) => (
          <a key={item.name} href={`?block=${item.name}`}>
            {item.label}{' '}
          </a>
        ))}
      </nav>
    </main>
  );
}
function ToastDemo() {
  const manager = Toast.useManager();
  return (
    <Button onClick={() => manager.add({ title: '主题提示', description: '继承当前主题变量', timeout: 0 })}>
      显示主题提示
    </Button>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
