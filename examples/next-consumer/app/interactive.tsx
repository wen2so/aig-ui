'use client';
import { useState } from 'react';
import { AigProvider, Button, Dialog } from 'aig-ui';
import { LoadingSequence } from 'aig-ui/motion';
import { Message } from 'aig-ui/ai';
/** 使用实际 tarball 验证交互、水合与主题内 Portal。 */
export function Interactive() {
  const [ready, setReady] = useState(false);
  return (
    <AigProvider style={{ '--aig-color-surface': 'rgb(240 246 250)' }}>
      <LoadingSequence
        taskId="next"
        status={ready ? 'ready' : 'loading'}
        label="准备内容"
        actions={<Button onClick={() => setReady(true)}>完成准备</Button>}
      >
        <p>客户端内容已就绪</p>
      </LoadingSequence>
      <Dialog.Root>
        <Dialog.Trigger render={<Button />}>打开对话框</Dialog.Trigger>
        <Dialog.Content material="solid">
          <Dialog.Title>Next 浮层</Dialog.Title>
          <Dialog.Description>服务端与客户端样式保持一致。</Dialog.Description>
          <Dialog.Close render={<Button />}>关闭</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
      <Message role="assistant" content="Markdown **正常显示**。" />
    </AigProvider>
  );
}
