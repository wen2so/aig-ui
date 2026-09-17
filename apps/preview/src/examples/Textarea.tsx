import { Textarea, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'states',
    title: '长文本与禁用',
    description: '页边线为连续阅读留出空间，文本域可向下拉伸。',
    render: () => (
      <div className="example-stack">
        <Textarea
          aria-label="项目说明"
          rows={4}
          defaultValue="把零散的想法整理成一份清晰的提案。\n记录背景、设计目标和下一步安排。"
        />
        <Textarea aria-label="归档说明" disabled defaultValue="这份资料已归档。" />
      </div>
    ),
    code: '<Textarea aria-label="项目说明" rows={4} />\n<Textarea aria-label="归档说明" disabled defaultValue="这份资料已归档。" />',
  },
];
export default examples;
