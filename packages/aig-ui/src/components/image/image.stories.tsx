import { Image } from './image.js';
export default { title: '数据展示/Image', component: Image };
export const preview = {
  name: 'Image',
  label: '图片',
  description: '展示图片、失败占位和可关闭的放大预览。',
};
const sample =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220"><rect width="400" height="220" fill="#f5f3ee"/><g fill="none" stroke="#7d4e57"><path d="M200 34 290 182H110Z"/><path d="M155 146H245"/><rect x="16" y="16" width="368" height="188" stroke-opacity=".3"/></g></svg>',
  );
/** 图片的可运行展示。 */
export function Preview() {
  return <Image src={sample} alt="精密线绘图形" width={400} height={220} caption="点击图片打开预览。" />;
}
