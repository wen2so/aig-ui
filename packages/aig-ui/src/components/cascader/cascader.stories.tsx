import { Cascader } from './cascader.js';
export default { title: '数据录入/Cascader', component: Cascader };
export const preview = { name: 'Cascader', label: '级联选择', description: '逐级选择叶节点并提交完整路径。' };
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
/** 用真实控件展示级联选择的输入和选择。 */
export function Preview() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <Cascader label="选择资料路径" options={nodes} name="documentPath" />
    </div>
  );
}
