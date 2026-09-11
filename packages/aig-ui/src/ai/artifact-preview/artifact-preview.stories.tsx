import{useState}from'react';
import { ArtifactPreview } from './artifact-preview.js';
export default { title: 'AI/ArtifactPreview', component: ArtifactPreview };
export const preview = {"name":"ArtifactPreview","label":"产物预览","description":"查看文本或 Markdown 版本，编辑草稿并转入明确的应用确认。"};
/** 展示可复用组件的代表性状态。 */
export function Preview() { const[versions,setVersions]=useState([{revision:'1',content:'初始摘要。'},{revision:'2',content:'## 项目摘要\n\n已完成资料整理，等待审阅。'}]);const[notice,setNotice]=useState('');return <><ArtifactPreview artifactId="demo-artifact" title="生成的项目摘要" versions={versions} format="markdown" onSave={change=>setVersions([...versions,{revision:String(versions.length+1),content:change.content}])} onApply={change=>setNotice(`版本 ${change.revision} 已进入演示审核流程。`)}/><p role="status">{notice}</p></>; }
