'use client';
import type {ComponentPropsWithRef} from 'react';
/** checked 和 defaultChecked 对应受控与非受控使用。 */
export interface SwitchProps extends Omit<ComponentPropsWithRef<'input'>,'type'|'role'> {onCheckedChange?:(checked:boolean)=>void;}
/** 使用 switch 语义显示一个明确的开关状态。 */
export function Switch({onChange,onCheckedChange,className='',...props}:SwitchProps){return <input {...props} type="checkbox" role="switch" className={`aig-switch ${className}`} onChange={event=>{onChange?.(event);onCheckedChange?.(event.target.checked);}}/>;}
