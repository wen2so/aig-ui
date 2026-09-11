import { useState } from 'react';
import { Pagination } from './pagination.js';
export default { title: '通用/Pagination', component: Pagination };
export const preview = {
  name: 'Pagination',
  label: '分页',
  description: '受控分页与边界按钮，数据请求和页大小由宿主管理。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  const [page, setPage] = useState(1);
  return <Pagination page={page} pageCount={5} onPageChange={setPage} />;
}
