'use client';

import {useState} from 'react';
import {AigProvider,PageHeader,Dialog,Button} from 'aig-ui';
import {ArtifactPreview,Confirmation,ToolResult,type ArtifactVersion,type ArtifactChange} from 'aig-ui/ai';

export interface ArtifactReviewProps {artifactId:string;versions:ArtifactVersion[];onSave:(change:ArtifactChange)=>Promise<void>;onExecute:(change:ArtifactChange)=>Promise<void>;}

/** 审核绑定具体内容快照，实际执行仍由宿主校验权限和版本。 */
export function ArtifactReview({artifactId,versions,onSave,onExecute}:ArtifactReviewProps){
  const[review,setReview]=useState<ArtifactChange|null>(null);
  const[executing,setExecuting]=useState(false);
  return <AigProvider><div style={{maxWidth:900,margin:'0 auto',padding:24}}><PageHeader title="生成结果审核" description="预览、修改并确认要应用的内容。"/><div style={{display:'grid',gap:24}}><ToolResult name="摘要整理" purpose="展示已生成的文本版本，等待用户审阅。" status="awaiting-confirmation" output="可预览历史版本，或编辑当前最新版本。"/><ArtifactPreview artifactId={artifactId} title="项目摘要" versions={versions} format="markdown" onSave={onSave} onApply={setReview}/></div>
    <Dialog.Root open={review!==null} onOpenChange={(open,details)=>{if(executing){details.cancel();return;}if(!open)setReview(null);}}><Dialog.Content><Dialog.Title>确认应用项目摘要</Dialog.Title><Dialog.Description>检查目标、影响与版本后执行。</Dialog.Description>{review&&<Confirmation artifactId={review.artifactId} revision={review.revision} currentRevision={versions.at(-1)?.revision??''} target="当前项目说明" summary={review.content} impact="替换当前说明，历史版本保持可查看。" onConfirm={async identity=>{setExecuting(true);try{await onExecute({...review,...identity});}finally{setExecuting(false);}}} onReject={()=>setReview(null)}/>}<Dialog.Actions><Dialog.Close disabled={executing} render={<Button variant="outline"/>}>关闭审核</Dialog.Close></Dialog.Actions></Dialog.Content></Dialog.Root>
  </div></AigProvider>;
}
