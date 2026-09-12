'use client';

import {
  AigProvider,
  PageHeader,
  Panel,
  Result,
  DescriptionList,
  CopyButton,
  StatusIndicator,
  Link,
} from 'aig-ui';
import { LoadingSequence } from 'aig-ui/motion';

/** 路由或服务端提供真实访问状态和恢复地址。 */
export interface AccessStatePageProps {
  state: 'not-found' | 'session-expired' | 'forbidden';
  requestId: string;
  homeHref: string;
  loginHref?: string;
  taskId?: string;
  loading?: boolean;
}

/** 组合访问结果、请求信息和可操作的恢复入口。 */
export function AccessStatePage({
  state,
  requestId,
  homeHref,
  loginHref,
  taskId = 'access',
  loading = false,
}: AccessStatePageProps) {
  const descriptions = {
    'not-found': '当前地址对应的内容尚不可用，可以返回工作空间继续操作。',
    'session-expired': '重新登录后继续当前工作。',
    forbidden: '当前账户尚未获得此内容的访问权限，请联系项目管理员。',
  };
  return (
    <AigProvider
      className="aig-brand-scene"
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
          return;
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
          '--aig-scene-x',
          `${(event.clientX - bounds.left - bounds.width / 2) * 0.015}px`,
        );
        event.currentTarget.style.setProperty(
          '--aig-scene-y',
          `${(event.clientY - bounds.top - bounds.height / 2) * 0.015}px`,
        );
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.removeProperty('--aig-scene-x');
        event.currentTarget.style.removeProperty('--aig-scene-y');
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
        <LoadingSequence
          taskId={taskId}
          status={loading ? 'loading' : 'ready'}
          minimumVisibleMs={1600}
          label="AIG UI"
          description="正在检查工作空间状态"
        >
          <PageHeader title="工作空间访问" description="查看访问状态与后续操作。" />
          <Panel>
            <Panel.Body>
              <Result
                status={state}
                description={descriptions[state]}
                actions={
                  <>
                    <Link href={homeHref}>返回工作空间</Link>
                    {state === 'session-expired' && loginHref && <Link href={loginHref}>重新登录</Link>}
                  </>
                }
              />
            </Panel.Body>
            <Panel.Footer>
              <DescriptionList
                items={[
                  {
                    id: 'request',
                    label: '请求标识',
                    value: <CopyButton value={requestId} label="复制请求标识" />,
                  },
                  { id: 'value', label: '完整标识', value: requestId },
                ]}
                columns={2}
              />
              <div style={{ marginTop: 20 }}>
                <StatusIndicator tone="neutral" label="访问状态由宿主提供" />
              </div>
            </Panel.Footer>
          </Panel>
        </LoadingSequence>
      </div>
    </AigProvider>
  );
}
