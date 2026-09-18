import { Avatar } from './avatar.js';
export default { title: '数据展示/Avatar', component: Avatar };
export const preview = { name: 'Avatar', label: '头像', description: '展示头像，图片失败时回退到姓名。' };
/** 头像的可运行展示。 */
export function Preview() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Avatar name="林舟" />
      <Avatar name="设计团队" size={48} />
      <Avatar name="图片不可用" src="data:image/png;base64,aW52YWxpZA==" />
    </div>
  );
}
