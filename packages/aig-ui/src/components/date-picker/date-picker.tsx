'use client';
import type { ComponentPropsWithRef } from 'react';
import { Input } from '../input/input.js';
export interface DatePickerProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  /** 使用 YYYY-MM-DD 字符串，清空时返回空字符串。 */ onValueChange?: (value: string) => void;
}
/** 本地日期不转为 UTC 时间戳，保留浏览器日历、键盘和表单约束。 */
export function DatePicker({ onValueChange, onChange, className = '', ...props }: DatePickerProps) {
  return (
    <Input
      {...props}
      type="date"
      className={`aig-date-picker ${className}`}
      onChange={(event) => {
        onChange?.(event);
        if (!event.defaultPrevented) onValueChange?.(event.target.value);
      }}
    />
  );
}
