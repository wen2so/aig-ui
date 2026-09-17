import { SequenceDemo, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'sequence',
    title: '完整加载交接',
    description: '重播、暂停、慢速、失败恢复和原版对照。任务就绪后完成撤回与内容交接。',
    render: () => <SequenceDemo />,
    code: '<LoadingSequence taskId={taskId} status={status}>\n  <Workspace />\n</LoadingSequence>',
    wide: true,
  },
];
export default examples;
