import{useState}from'react';import{Message}from'../message/message.js';import{Button}from'../../components/button/button.js';
import { Conversation } from './conversation.js';
export default { title: 'AI/Conversation', component: Conversation };
export const preview = {"name":"Conversation","label":"对话容器","description":"在底部跟随消息，向上阅读时保持位置，支持历史插入与回到底部。"};
/** 展示可复用组件的代表性状态。 */
export function Preview() { const[ids,setIds]=useState(Array.from({length:16},(_,i)=>i));return <><div style={{display:'flex',gap:12,marginBottom:12}}><Button size="sm" variant="outline" onClick={()=>setIds([...ids,(ids.at(-1)??0)+1])}>追加演示消息</Button><Button size="sm" variant="outline" onClick={()=>setIds([(ids[0]??0)-1,...ids])}>加载历史消息</Button></div><Conversation firstMessageId={String(ids[0])} lastMessageId={String(ids.at(-1))} style={{height:280}}>{ids.map(id=><Message key={id} role={id%2===0?'user':'assistant'} content={`演示消息 ${id}：向上阅读时保留当前位置，新的内容通过按钮提示。`}/>)}</Conversation></>; }
