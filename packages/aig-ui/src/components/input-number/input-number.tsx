'use client';
import type { ComponentPropsWithRef } from 'react';
import { Input } from '../input/input.js';
export interface InputNumberProps extends Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'value' | 'defaultValue'
> {
  value?: number | null;
  defaultValue?: number;
  /** 空输入以 null 表达；min、max 和 step 参与原生表单校验。 */ onValueChange?: (
    value: number | null,
  ) => void;
}
/** 使用原生数值输入保留步进、表单校验和清空语义。 */
export function InputNumber({ value, onValueChange, onChange, className = '', ...props }: InputNumberProps) {
  return (
    <Input
      {...props}
      type="number"
      className={`aig-input-number ${className}`}
      value={value === null ? '' : value}
      onChange={(event) => {
        onChange?.(event);
        if (!event.defaultPrevented)
          onValueChange?.(Number.isNaN(event.target.valueAsNumber) ? null : event.target.valueAsNumber);
      }}
    />
  );
}
