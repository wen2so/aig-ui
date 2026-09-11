
import { ToolResult } from './tool-result.js';
export default { title: 'AI/ToolResult', component: ToolResult };
export const preview = {"name":"ToolResult","label":"工具结果","description":"展示工具用途、公开输入摘要、任务状态、结果和错误。"};
/** 展示可复用组件的代表性状态。 */
export function Preview() { return <ToolResult name="资料解析" purpose="读取本地演示文件，提取可公开摘要。" status="succeeded" inputSummary="文件：示例资料.txt" output="已读取 3 个段落，未发现格式错误。"/>; }
