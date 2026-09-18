import { TreeSelect } from './tree-select.js';
export default { title: '数据录入/TreeSelect', component: TreeSelect };
export const preview = {
  name: 'TreeSelect',
  label: '树选择',
  description: '从树形目录选择节点并提交稳定标识。',
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
/** 用真实控件展示树选择的输入和选择。 */
export function Preview() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <TreeSelect label="选择资料" nodes={nodes} defaultValue="design" name="documentId" />
    </div>
  );
}
