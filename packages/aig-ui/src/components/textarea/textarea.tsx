import type {ComponentPropsWithRef} from 'react';
/** 默认显示四行，按原生 onChange 传递编辑内容。 */
export function Textarea({rows=4,className='',...props}:ComponentPropsWithRef<'textarea'>){return <textarea {...props} rows={rows} className={`aig-textarea ${className}`}/>;}
