import { Tree } from './tree.js';
export default { title: '数据展示/Tree', component: Tree };
export const preview = {
  name: 'Tree',
  label: '树形控件',
  description: '按层级浏览内容，支持展开、键盘导航与单选。',
};
const nodes = [
  {
    id: 'project',
    label: '项目资料',
    children: [
      { id: 'design', label: '设计文件' },
      { id: 'review', label: '审核记录' },
      { id: 'locked', label: '只读资料', disabled: true },
    ],
  },
];
/** 用真实控件展示树形控件的输入和选择。 */
export function Preview() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <Tree label="项目目录" nodes={nodes} defaultExpandedIds={['project']} />
    </div>
  );
}
