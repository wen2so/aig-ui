import { Slider } from './slider.js';
export default { title: '数据录入/Slider', component: Slider };
export const preview = {
  name: 'Slider',
  label: '滑动输入条',
  description: '在限定范围内拖动或通过键盘调整数值。',
};
/** 用真实控件展示滑动输入条的输入和选择。 */
export function Preview() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <Slider
        label="预览缩放"
        min={25}
        max={200}
        defaultValue={100}
        step={5}
        formatValue={(value) => value + '%'}
      />
    </div>
  );
}
