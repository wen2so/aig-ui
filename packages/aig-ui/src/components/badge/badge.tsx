import type { ComponentPropsWithRef } from 'react';
/** 跨组件使用的状态色。 */
export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
/** 文字标签，默认 neutral。 */
export function Badge({tone='neutral',className='',...props}:ComponentPropsWithRef<'span'> & {tone?:Tone}) { return <span {...props} data-tone={tone} className={`aig-badge ${className}`} />; }
