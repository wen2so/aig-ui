'use client';
import { useEffect, useId, useImperativeHandle, useRef, useState, type ComponentPropsWithRef } from 'react';
export interface SliderProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'value' | 'defaultValue'> {
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  formatValue?: (value: number) => string;
}
/** 原生滑块负责键盘、边界和步长，输出值同时提供可读说明。 */
export function Slider({
  label,
  value,
  defaultValue = 0,
  min = 0,
  max = 100,
  onChange,
  onValueChange,
  formatValue = String,
  className = '',
  id: providedId,
  ref: forwardedRef,
  ...props
}: SliderProps) {
  const generated = useId();
  const id = providedId ?? generated;
  const [local, setLocal] = useState(defaultValue);
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(forwardedRef, () => input.current!, []);
  useEffect(() => {
    const form = input.current?.form;
    const reset = (event: Event) => {
      queueMicrotask(() => {
        if (!event.defaultPrevented && value === undefined && input.current)
          setLocal(input.current.valueAsNumber);
      });
    };
    form?.addEventListener('reset', reset);
    return () => form?.removeEventListener('reset', reset);
  }, [value, props.form]);
  const current = Math.min(Number(max), Math.max(Number(min), value ?? local));
  return (
    <div className={`aig-slider ${className}`}>
      <label htmlFor={id}>
        {label}
        <output htmlFor={id}>{formatValue(current)}</output>
      </label>
      <input
        {...props}
        ref={input}
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        aria-valuetext={formatValue(current)}
        onChange={(event) => {
          onChange?.(event);
          if (event.defaultPrevented) return;
          setLocal(event.target.valueAsNumber);
          onValueChange?.(event.target.valueAsNumber);
        }}
      />
    </div>
  );
}
