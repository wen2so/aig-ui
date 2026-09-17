import { ValidationDemo, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'validation',
    title: '校验与恢复',
    description: '标签、必填提示、错误说明与输入关联。',
    render: () => <ValidationDemo />,
    code: '<Field label="项目名称" required error={error}>\n  {(props) => <Input {...props} />}\n</Field>',
  },
];
export default examples;
