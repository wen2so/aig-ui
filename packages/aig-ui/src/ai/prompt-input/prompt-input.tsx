'use client';
import{useId,useRef,useState,type ComponentPropsWithRef}from'react';
import{Textarea}from'../../components/textarea/textarea.js';
import{Button}from'../../components/button/button.js';
/** 输入状态与模型服务保持独立。 */
export interface PromptInputProps extends Omit<ComponentPropsWithRef<'div'>,'onSubmit'|'defaultValue'> {value?:string;defaultValue?:string;onValueChange?:(value:string)=>void;onSubmit:(value:string)=>void|Promise<void>;onStop?:()=>void;running?:boolean;label?:string;disabled?:boolean;}
/** Enter 发送，Shift+Enter 换行；合成输入期间保留原生按键。 */
export function PromptInput({value,defaultValue='',onValueChange,onSubmit,onStop,running=false,label='输入任务',disabled=false,className='',...props}:PromptInputProps){
 const[draft,setDraft]=useState(defaultValue);const[error,setError]=useState('');const[sending,setSending]=useState(false);const lock=useRef(false);const composing=useRef(false);const id=useId();const text=value??draft;
 async function submit(){if(lock.current||running||disabled||!text.trim())return;lock.current=true;setSending(true);setError('');try{await onSubmit(text.trim());}catch(reason){setError(reason instanceof Error?reason.message:'发送未完成，请重试。');}finally{lock.current=false;setSending(false);}}
 return <div {...props} className={`aig-prompt-input ${className}`}><Textarea aria-label={label} aria-describedby={error?id:undefined} value={text} disabled={disabled} rows={3} onChange={event=>{if(value===undefined)setDraft(event.target.value);onValueChange?.(event.target.value);}} onCompositionStart={()=>{composing.current=true;}} onCompositionEnd={()=>{composing.current=false;}} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.repeat&&!event.nativeEvent.isComposing&&!composing.current&&event.keyCode!==229){event.preventDefault();void submit();}}}/><div className="aig-prompt-actions"><span>Enter 发送 · Shift+Enter 换行</span>{running?<Button variant="outline" onClick={onStop} disabled={!onStop}>停止生成</Button>:<Button onClick={()=>void submit()} disabled={disabled||!text.trim()} loading={sending}>发送</Button>}</div>{error&&<p id={id} role="alert">{error}</p>}</div>;
}
