import { useState } from 'react';
import { Star } from 'lucide-react';
import { IconButton } from './icon-button.js';
export default { title: '通用/IconButton', component: IconButton };
export const preview = {
  name: 'IconButton',
  label: '图标按钮',
  description: '具有必需可访问名称的图标操作按钮。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconButton aria-label="收藏项目" aria-pressed={saved} onClick={() => setSaved(!saved)}>
        <Star size={18} aria-hidden />
      </IconButton>
      <span role="status">{saved ? '项目已收藏' : '项目尚未收藏'}</span>
    </div>
  );
}
