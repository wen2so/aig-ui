import { RadioGroup, options, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'disabled',
    title: '部分选项锁定',
    description: '选中内核和下划线共同提示当前值。',
    render: () => <RadioGroup label="资料类型" options={options} defaultValue="design" />,
    code: '<RadioGroup label="资料类型" defaultValue="design" options={options} />',
  },
];
export default examples;
