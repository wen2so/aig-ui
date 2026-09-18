import { Anchor } from './anchor.js';
export default { title: '导航/Anchor', component: Anchor };
export const preview = { name: 'Anchor', label: '锚点', description: '定位页面章节并标记滚动位置。' };
/** 可直接运行的布局与交互示例。 */
export function Preview() {
  return (
    <div>
      <Anchor
        items={[
          { id: 'anchor-summary', title: '项目摘要' },
          { id: 'anchor-details', title: '处理详情' },
        ]}
      />
      <section id="anchor-summary" style={{ scrollMarginTop: 90, paddingBlock: 30 }}>
        项目摘要
      </section>
      <section id="anchor-details" style={{ scrollMarginTop: 90, paddingBlock: 30 }}>
        处理详情
      </section>
    </div>
  );
}
