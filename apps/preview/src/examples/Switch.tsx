import { Switch, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'states',
    title: '开启、关闭与锁定',
    description: '菱形内核沿轨道平移，开闭与禁用状态保持清晰。',
    render: () => (
      <div className="example-stack">
        <label>
          <Switch defaultChecked /> 自动保存
        </label>
        <label>
          <Switch /> 邮件通知
        </label>
        <label>
          <Switch disabled /> 等待管理员开放
        </label>
        <label>
          <Switch disabled defaultChecked /> 组织已启用
        </label>
      </div>
    ),
    code: '<Switch defaultChecked />\n<Switch />\n<Switch disabled />\n<Switch disabled defaultChecked />',
  },
];
export default examples;
