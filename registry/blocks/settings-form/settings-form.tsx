'use client';

import { useEffect, useRef, useState } from 'react';
import { AigProvider, PageHeader, Field, Input, Textarea, Switch, Select, Tabs, Button, Alert, Toast } from 'aig-ui';

export interface SettingsValues {name:string;description:string;visibility:string;notifications:boolean;}
export interface SettingsFormProps {initialValues:SettingsValues;onSave:(values:SettingsValues)=>Promise<void>;}

/** 宿主提供保存服务，表单保留失败后的草稿。 */
export function SettingsForm(props:SettingsFormProps){return <AigProvider><Toast.Provider><Form {...props}/></Toast.Provider></AigProvider>;}

function Form({initialValues,onSave}:SettingsFormProps){
  const [values,setValues]=useState(initialValues);
  const [saved,setSaved]=useState(initialValues);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [nameError,setNameError]=useState('');
  const [tab,setTab]=useState<string|number|null>('basic');
  const nameRef=useRef<HTMLInputElement>(null);
  const lock=useRef(false);
  const toast=Toast.useManager();
  const dirty=JSON.stringify(values)!==JSON.stringify(saved);
  useEffect(()=>{if(!dirty)return;const leave=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};window.addEventListener('beforeunload',leave);return()=>window.removeEventListener('beforeunload',leave);},[dirty]);
  async function submit(){
    if(lock.current)return;
    if(!values.name.trim()){setNameError('请填写项目名称。');setTab('basic');requestAnimationFrame(()=>nameRef.current?.focus());return;}
    lock.current=true;setBusy(true);setError('');setNameError('');
    const submitted={...values,name:values.name.trim()};
    try{await onSave(submitted);setValues(submitted);setSaved(submitted);toast.add({title:'设置已保存'});}catch(reason){setError(reason instanceof Error?reason.message:'保存未完成，草稿已保留。');}finally{lock.current=false;setBusy(false);}
  }
  return <div style={{maxWidth:760,margin:'0 auto',padding:24}}><PageHeader title="项目设置" description="设置名称、可见范围与通知偏好。"/><form noValidate onSubmit={event=>{event.preventDefault();void submit();}}><Tabs.Root value={tab} onValueChange={setTab}><Tabs.List aria-label="设置类别"><Tabs.Tab value="basic">基本信息</Tabs.Tab><Tabs.Tab value="notifications">通知偏好</Tabs.Tab></Tabs.List><Tabs.Panel value="basic" keepMounted><div style={{display:'grid',gap:24}}><Field label="项目名称" required error={nameError}>{props=><Input {...props} ref={nameRef} disabled={busy} value={values.name} onChange={event=>setValues({...values,name:event.target.value})}/>}</Field><Field label="项目说明">{props=><Textarea {...props} disabled={busy} value={values.description} onChange={event=>setValues({...values,description:event.target.value})}/>}</Field><Select label="可见范围" disabled={busy} value={values.visibility} onValueChange={value=>setValues({...values,visibility:value??'private'})} options={[{value:'private',label:'仅自己'},{value:'team',label:'项目成员'}]}/></div></Tabs.Panel><Tabs.Panel value="notifications" keepMounted><label><Switch disabled={busy} checked={values.notifications} onCheckedChange={notifications=>setValues({...values,notifications})}/> 接收处理结果通知</label></Tabs.Panel></Tabs.Root>{error&&<Alert tone="danger" title="保存未完成">{error}</Alert>}<div style={{display:'flex',gap:16,alignItems:'center',flexWrap:'wrap',marginTop:24}}><Button type="submit" loading={busy}>保存设置</Button><span role="status">{dirty?'有尚未保存的修改':'当前设置已同步'}</span></div></form></div>;
}
