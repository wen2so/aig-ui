'use client';
import type { ComponentPropsWithRef } from 'react';
import { Input } from '../input/input.js';
export interface TimePickerProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  /** 返回 HH:mm 或包含秒的时间字符串，清空时为空。 */ onValueChange?: (value: string) => void;
}
/** 时间字符串不附加日期和时区，秒级选择由 step 决定。 */
export function TimePicker({ onValueChange, onChange, className = '', ...props }: TimePickerProps) {
  return (
    <Input
      {...props}
      type="time"
      className={`aig-time-picker ${className}`}
      onChange={(event) => {
        onChange?.(event);
        if (!event.defaultPrevented) onValueChange?.(event.target.value);
      }}
    />
  );
}
