import { Grid } from './grid.js';
import { Card } from '../card/card.js';
export default { title: '布局/Grid', component: Grid };
export const preview = { name: 'Grid', label: '栅格', description: '按列数或最小列宽自动组织内容。' };
/** 可直接运行的布局与交互示例。 */
export function Preview() {
  return (
    <Grid minColumnWidth={160}>
      {['设计资料', '处理任务', '审核结果'].map((title) => (
        <Card key={title}>{title}</Card>
      ))}
    </Grid>
  );
}
