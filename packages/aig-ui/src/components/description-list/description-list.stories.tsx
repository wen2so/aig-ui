import { DescriptionList } from './description-list.js';
export default { title: '通用/DescriptionList', component: DescriptionList };
export const preview = {
  name: 'DescriptionList',
  label: '描述列表',
  description: '使用 dl、dt、dd 展示标签和值，支持长标识与响应式分列。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <DescriptionList
      columns={2}
      items={[
        { id: 'project', label: '项目名称', value: '智能产品工作空间' },
        {
          id: 'request',
          label: '请求标识',
          value: 'request-2026-09-12-abcdefghijklmnopqrstuvwxyz0123456789',
        },
      ]}
    />
  );
}
