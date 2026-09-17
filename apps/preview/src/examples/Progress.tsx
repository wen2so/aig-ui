import { ProgressDemo, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'interactive',
    title: '调整实际进度',
    description: '拖动滑块对比已知进度与未知进度。',
    render: () => <ProgressDemo />,
    code: '<Progress value={64} label="资料导入进度" />\n<Progress label="正在等待结果" />',
  },
];
export default examples;
