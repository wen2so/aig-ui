import { Heading } from 'aig-ui/heading';
import { Panel } from 'aig-ui/panel';
import { Interactive } from './interactive';
/** 服务端渲染展示组件，交互区域显式进入客户端边界。 */
export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <Heading>Next 服务端消费验证</Heading>
      <Panel>
        <Panel.Body>来自服务端的展示内容</Panel.Body>
      </Panel>
      <Interactive />
    </main>
  );
}
