'use client';
import{useState,useRef,type ComponentPropsWithRef}from'react';
import{SafeMarkdown}from'../safe-markdown.js';
import{Textarea}from'../../components/textarea/textarea.js';
import{Button}from'../../components/button/button.js';
export interface ArtifactVersion {revision:string;content:string;}
export interface ArtifactChange {artifactId:string;revision:string;content:string;}
/** versions 按历史到最新排列；宿主保存时创建新 revision。 */
export interface ArtifactPreviewProps extends Omit<ComponentPropsWithRef<'section'>,'title'> {artifactId:string;title:string;versions:ArtifactVersion[];format?:'text'|'markdown';onSave?:(change:ArtifactChange)=>void|Promise<void>;onApply?:(change:ArtifactChange)=>void;}
/** 查看历史版本，编辑和应用入口只针对当前最新版本。 */
export function ArtifactPreview({artifactId,title,versions,format='text',onSave,onApply,className='',...props}:ArtifactPreviewProps){
 const[selected,setSelected]=useState<string|undefined>();const[editing,setEditing]=useState(false);const version=versions.find(item=>item.revision===selected)??versions.at(-1);const latest=version?.revision===versions.at(-1)?.revision;
 return <section {...props} className={`aig-artifact-preview ${className}`}><header><h3>{title}</h3><label>版本 <select aria-label="产物版本" value={version?.revision??''} disabled={editing||!version} onChange={event=>setSelected(event.target.value)}>{versions.map(item=><option key={item.revision} value={item.revision}>{item.revision}</option>)}</select></label></header>{version?<ArtifactBody key={JSON.stringify([artifactId,version.revision])} artifactId={artifactId} version={version} format={format} latest={latest} editing={editing} onEditingChange={setEditing} onSave={onSave} onApply={onApply}/>:<p>当前尚无可预览的版本。</p>}</section>;
}
function ArtifactBody({artifactId,version,format,latest,editing,onEditingChange,onSave,onApply}:{artifactId:string;version:ArtifactVersion;format:'text'|'markdown';latest:boolean;editing:boolean;onEditingChange:(editing:boolean)=>void;onSave?:ArtifactPreviewProps['onSave'];onApply?:ArtifactPreviewProps['onApply']}){
 const[draft,setDraft]=useState(version.content);const[pending,setPending]=useState(false);const[error,setError]=useState('');const lock=useRef(false);
 async function save(){if(lock.current||!latest)return;lock.current=true;setPending(true);setError('');try{await onSave?.({artifactId,revision:version.revision,content:draft});onEditingChange(false);}catch(reason){setError(reason instanceof Error?reason.message:'保存未完成，草稿已保留。');}finally{lock.current=false;setPending(false);}}
 return <>{editing?<Textarea aria-label="编辑产物内容" value={draft} disabled={pending} onChange={event=>setDraft(event.target.value)} rows={8}/>:<div className="aig-artifact-content">{format==='markdown'?<SafeMarkdown>{version.content}</SafeMarkdown>:<pre>{version.content}</pre>}</div>}{!latest&&<p>历史版本仅供查看。</p>}{error&&<p role="alert">{error}</p>}<div className="aig-artifact-actions">{editing?<><Button loading={pending} disabled={!latest} onClick={()=>void save()}>保存修改</Button><Button variant="outline" disabled={pending} onClick={()=>{setDraft(version.content);onEditingChange(false);setError('');}}>取消编辑</Button></>:<>{onSave&&<Button variant="outline" disabled={!latest} onClick={()=>onEditingChange(true)}>编辑内容</Button>}{onApply&&<Button disabled={!latest} onClick={()=>onApply({artifactId,revision:version.revision,content:version.content})}>审核并应用</Button>}</>}</div></>;
}
