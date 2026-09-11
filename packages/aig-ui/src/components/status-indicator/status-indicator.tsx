import type { ComponentPropsWithRef } from 'react';
import type { Tone } from '../badge/badge.js';
/** label 为状态含义，颜色作为补充。 */
export function StatusIndicator({tone='neutral',label,busy=false,className='',...props}:ComponentPropsWithRef<'span'> & {tone?:Tone;label:string;busy?:boolean}) { return <span {...props} role="status" data-tone={tone} aria-busy={busy || undefined} className={`aig-status-indicator ${className}`}><span aria-hidden className="aig-status-dot" />{label}</span>; }
