import { MarkDemo, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'drawing',
    title: '绘制与反向撤回',
    description: '从当前描边位置撤回，双环保持相反方向的运行节奏。',
    render: () => <MarkDemo />,
    code: '<LoadingMark phase="drawing" label="加载标记" />',
    wide: true,
  },
];
export default examples;
