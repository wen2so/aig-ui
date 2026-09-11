import { Settings } from 'lucide-react';
import { IconButton } from './icon-button.js';
export default { title: '通用/IconButton', component: IconButton };
export const preview = {
  name: 'IconButton',
  label: '图标按钮',
  description: '具有必需可访问名称的图标操作按钮。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <IconButton
      aria-label="打开设置"
      onClick={(event) => {
        event.currentTarget.setAttribute('aria-label', '设置已打开');
      }}
    >
      <Settings size={18} aria-hidden />
    </IconButton>
  );
}
