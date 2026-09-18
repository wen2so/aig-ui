'use client';
import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
export interface SegmentedOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}
export interface SegmentedProps extends Omit<ComponentPropsWithRef<'fieldset'>, 'onChange' | 'defaultValue'> {
  label: string;
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  form?: string;
}
/** 原生单选组提供方向键与表单重置，分段外观用于少量互斥选择。 */
export function Segmented({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  form,
  disabled,
  className = '',
  ...props
}: SegmentedProps) {
  const id = useId();
  return (
    <fieldset {...props} disabled={disabled} className={`aig-segmented ${className}`}>
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name={name ?? id}
              form={form}
              value={option.value}
              checked={value === undefined ? undefined : value === option.value}
              defaultChecked={
                value === undefined
                  ? (defaultValue ?? options.find((item) => !item.disabled)?.value) === option.value
                  : undefined
              }
              disabled={disabled || option.disabled}
              onChange={() => onValueChange?.(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
