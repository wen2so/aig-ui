import { CircleCheck, Inbox, TriangleAlert } from 'lucide-react';
import { Icon } from '../components/icon/icon.js';
/** 结果与空态使用 Lucide 状态图标，名称由外层文字表达。 */
export function StatusGlyph({ success = false, empty = false }: { success?: boolean; empty?: boolean }) {
  return <Icon icon={success ? CircleCheck : empty ? Inbox : TriangleAlert} className="aig-status-glyph" />;
}
