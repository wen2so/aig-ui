import { Select, options, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'states',
    title: '占位、禁用与失效值',
    description: '展开选择器体验可用和禁用选项，失效值仍保留可读提示。',
    render: () => (
      <div className="example-stack">
        <Select label="选择资料类型" options={options} />
        <Select label="锁定资料类型" options={options} disabled defaultValue="design" />
        <Select label="已失效资料类型" options={options} defaultValue="old" />
        <Select label="空选项" options={[]} />
      </div>
    ),
    code: '<Select label="选择资料类型" options={options} />\n<Select label="锁定资料类型" options={options} disabled />\n<Select label="空选项" options={[]} />',
  },
];
export default examples;
