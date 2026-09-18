import { Segmented } from './segmented.js';
export default { title: '数据展示/Segmented', component: Segmented };
export const preview = { name: 'Segmented', label: '分段控制器', description: '在少量互斥选项之间切换。' };
/** 分段控制器的可运行展示。 */
export function Preview() {
  return (
    <Segmented
      label="展示方式"
      name="view"
      defaultValue="list"
      options={[
        { value: 'list', label: '列表' },
        { value: 'grid', label: '网格' },
        { value: 'map', label: '地图', disabled: true },
      ]}
    />
  );
}
