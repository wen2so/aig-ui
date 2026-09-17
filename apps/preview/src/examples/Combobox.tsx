import { Combobox, options, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'states',
    title: '检索与空结果',
    description: '按名称检索资料，保留禁用选项和空结果说明。',
    render: () => (
      <div className="example-stack">
        <Combobox label="检索资料类型" options={options} placeholder="输入设计或调研" />
        <Combobox label="锁定检索" options={options} disabled defaultValue="design" />
      </div>
    ),
    code: '<Combobox label="检索资料类型" options={options} />\n<Combobox label="锁定检索" options={options} disabled />',
  },
];
export default examples;
