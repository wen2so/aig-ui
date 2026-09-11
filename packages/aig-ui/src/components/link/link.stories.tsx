import { Link } from './link.js';
export default { title: '通用/Link', component: Link };
export const preview = {
  name: 'Link',
  label: '链接',
  description: '原生导航链接，支持长地址换行和安全外链属性。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return <Link href="#top">回到组件总览</Link>;
}
