import { useState } from 'react';
import { AccessStatePage } from '../../../registry/blocks/access-state-page/access-state-page.js';
import { SettingsForm } from '../../../registry/blocks/settings-form/settings-form.js';
import { FilterableList } from '../../../registry/blocks/filterable-list/filterable-list.js';

export const pageEntries = [
  { name:'access-state-page',label:'访问状态页',group:'页面组合',description:'根据真实访问状态组合结果、请求信息与恢复入口。',render:()=> <AccessDemo/> },
  { name:'settings-form',label:'设置表单',group:'页面组合',description:'编辑、字段校验、保存失败和草稿保留。本地演示数据。',render:()=> <SettingsDemo/> },
  { name:'filterable-list',label:'筛选列表',group:'页面组合',description:'筛选、分页、空状态、读取错误与详情抽屉。本地演示数据。',render:()=> <ListDemo/> },
];

function SettingsDemo(){const[fail,setFail]=useState(true);return <><label><input type="checkbox" checked={fail} onChange={event=>setFail(event.target.checked)}/> 模拟保存失败</label><SettingsForm initialValues={{name:'演示项目',description:'用于预览组件组合。',visibility:'team',notifications:true}} onSave={async()=>{if(fail)throw Error('演示保存失败，修改内容已保留。');}}/></>;}

const listItems=Array.from({length:12},(_,index)=>({id:`demo-${index+1}`,name:`项目资料 ${index+1}`,status:index%3?'已完成':'待确认',description:'本地演示资料，用于验证筛选和详情交互。'}));
function ListDemo(){const[query,setQuery]=useState('');const[page,setPage]=useState(1);const[status,setStatus]=useState<'loading'|'ready'|'error'>('ready');const filtered=listItems.filter(item=>item.name.includes(query));return <><label>演示列表状态 <select value={status} onChange={event=>setStatus(event.target.value as typeof status)}><option value="ready">读取完成</option><option value="loading">加载中</option><option value="error">读取失败</option></select></label><FilterableList items={filtered.slice((page-1)*5,page*5)} query={query} page={page} pageCount={Math.ceil(filtered.length/5)} status={status} onQueryChange={value=>{setQuery(value);setPage(1);}} onPageChange={setPage} onRetry={()=>setStatus('ready')}/></>;}

function AccessDemo() {
  const [state,setState]=useState<'not-found'|'session-expired'|'forbidden'>('session-expired');
  return <><label>演示访问状态 <select value={state} onChange={event=>setState(event.target.value as typeof state)}><option value="not-found">页面未找到</option><option value="session-expired">登录已过期</option><option value="forbidden">访问受限</option></select></label><AccessStatePage state={state} requestId="demo-request-20260912" homeHref="/?component=access-state-page" loginHref="/?component=access-state-page"/></>;
}
