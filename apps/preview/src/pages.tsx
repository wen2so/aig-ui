import { useState } from 'react';
import { AccessStatePage } from '../../../registry/blocks/access-state-page/access-state-page.js';
import { SettingsForm } from '../../../registry/blocks/settings-form/settings-form.js';

export const pageEntries = [
  { name:'access-state-page',label:'访问状态页',group:'页面组合',description:'根据真实访问状态组合结果、请求信息与恢复入口。',render:()=> <AccessDemo/> },
  { name:'settings-form',label:'设置表单',group:'页面组合',description:'编辑、字段校验、保存失败和草稿保留。本地演示数据。',render:()=> <SettingsDemo/> },
];

function SettingsDemo(){const[fail,setFail]=useState(true);return <><label><input type="checkbox" checked={fail} onChange={event=>setFail(event.target.checked)}/> 模拟保存失败</label><SettingsForm initialValues={{name:'演示项目',description:'用于预览组件组合。',visibility:'team',notifications:true}} onSave={async()=>{if(fail)throw Error('演示保存失败，修改内容已保留。');}}/></>;}

function AccessDemo() {
  const [state,setState]=useState<'not-found'|'session-expired'|'forbidden'>('session-expired');
  return <><label>演示访问状态 <select value={state} onChange={event=>setState(event.target.value as typeof state)}><option value="not-found">页面未找到</option><option value="session-expired">登录已过期</option><option value="forbidden">访问受限</option></select></label><AccessStatePage state={state} requestId="demo-request-20260912" homeHref="/?component=access-state-page" loginHref="/?component=access-state-page"/></>;
}
