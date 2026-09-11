import type{ComponentPropsWithRef}from'react';
import{safeUrl}from'../safe-markdown.js';
export interface Source {id:string;title:string;url?:string;snippet?:string;time?:string;}
/** 来源真实性和时间含义由宿主保证。 */
export function SourceList({sources,className='',...props}:ComponentPropsWithRef<'ol'>&{sources:Source[]}){return <ol {...props} className={`aig-source-list ${className}`}>{sources.map(source=>{const href=source.url&&/^https?:\/\//i.test(source.url)?safeUrl(source.url):undefined;return <li key={source.id}>{href?<a href={href} target="_blank" rel="noopener noreferrer">{source.title}</a>:<span>{source.title}</span>}{source.snippet&&<p>{source.snippet}</p>}{source.time&&<small>{source.time}</small>}</li>;})}</ol>;}
