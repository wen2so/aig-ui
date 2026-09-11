import type { ComponentPropsWithRef } from 'react';
/** 保留原生 input 的事件、ref、类型与表单属性。 */
export function Input({ className = '', ...props }: ComponentPropsWithRef<'input'>) {
  return <input {...props} className={`aig-input ${className}`} />;
}
