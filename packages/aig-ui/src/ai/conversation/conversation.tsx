'use client';
import{useLayoutEffect,useRef,useState,type ComponentPropsWithRef}from'react';
import{Button}from'../../components/button/button.js';
/** 首尾消息标识用于区分追加和历史插入。 */
export interface ConversationProps extends Omit<ComponentPropsWithRef<'div'>,'ref'> {firstMessageId?:string;lastMessageId?:string;label?:string;}
/** 只在用户位于底部时跟随更新，保留历史阅读位置。 */
export function Conversation({children,firstMessageId,lastMessageId,label='对话记录',className='',onScroll,...props}:ConversationProps){
 const viewport=useRef<HTMLDivElement>(null);const body=useRef<HTMLDivElement>(null);const follow=useRef(true);const previous=useRef({first:firstMessageId,height:0});const[atBottom,setAtBottom]=useState(true);const[unread,setUnread]=useState(false);
 useLayoutEffect(()=>{const element=viewport.current;if(!element)return;if(previous.current.height&&firstMessageId!==previous.current.first&&!follow.current){element.scrollTop+=element.scrollHeight-previous.current.height;}else if(follow.current){element.scrollTop=element.scrollHeight;}else{setUnread(true);}previous.current={first:firstMessageId,height:element.scrollHeight};},[children,firstMessageId,lastMessageId]);
 useLayoutEffect(()=>{if(!body.current||typeof ResizeObserver==='undefined')return;const observer=new ResizeObserver(()=>{const element=viewport.current;if(element&&follow.current)element.scrollTop=element.scrollHeight;});observer.observe(body.current);return()=>observer.disconnect();},[]);
 function bottom(){const element=viewport.current;if(element)element.scrollTop=element.scrollHeight;follow.current=true;setAtBottom(true);setUnread(false);}
 return <div className="aig-conversation"><div {...props} ref={viewport} role="region" aria-label={label} tabIndex={0} className={`aig-conversation-viewport ${className}`} onScroll={event=>{const element=event.currentTarget;follow.current=element.scrollHeight-element.clientHeight-element.scrollTop<=32;setAtBottom(follow.current);if(follow.current)setUnread(false);onScroll?.(event);}}><div ref={body}>{children}</div></div>{!atBottom&&<Button size="sm" variant="outline" onClick={bottom}>{unread?'有新内容，回到底部':'回到底部'}</Button>}</div>;
}
