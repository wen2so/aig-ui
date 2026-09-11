'use client';
import{useEffect,useRef,useImperativeHandle,type ComponentPropsWithRef}from'react';
/** checked 系列用于可控选择，保留原生 onChange。 */
export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>,'type'> {onCheckedChange?:(checked:boolean)=>void;indeterminate?:boolean;}
/** 在真实 checkbox 上同步中间状态。 */
export function Checkbox({onCheckedChange,onChange,indeterminate=false,className='',ref,...props}:CheckboxProps){const input=useRef<HTMLInputElement>(null);useImperativeHandle(ref,()=>input.current!);useEffect(()=>{if(input.current)input.current.indeterminate=indeterminate;},[indeterminate]);return <input {...props} ref={input} type="checkbox" className={`aig-checkbox ${className}`} onChange={event=>{onChange?.(event);onCheckedChange?.(event.target.checked);}}/>;}
