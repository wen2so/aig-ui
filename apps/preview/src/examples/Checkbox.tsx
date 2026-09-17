import { Checkbox, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'states',
    title: '选择状态',
    description: '方形结构容纳对勾，中间态表示部分选中。',
    render: () => (
      <div className="example-stack">
        <label>
          <Checkbox defaultChecked /> 同步项目资料
        </label>
        <label>
          <Checkbox indeterminate /> 部分资料已选择
        </label>
        <label>
          <Checkbox disabled /> 等待开放
        </label>
        <label>
          <Checkbox defaultChecked disabled /> 已锁定的选择
        </label>
      </div>
    ),
    code: '<Checkbox defaultChecked />\n<Checkbox indeterminate />\n<Checkbox disabled />\n<Checkbox defaultChecked disabled />',
  },
];
export default examples;
