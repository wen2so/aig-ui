import { Statistic } from './statistic.js';
export default { title: '数据展示/Statistic', component: Statistic };
export const preview = {
  name: 'Statistic',
  label: '统计数值',
  description: '格式化数值，区分有效数据与未知值。',
};
/** 统计数值的可运行展示。 */
export function Preview() {
  return <Statistic title="已处理资料" value={1286} suffix="份" description="示例数据，用于展示数值排版。" />;
}
