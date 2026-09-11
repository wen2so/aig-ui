'use client';
import { useId, useState, type ComponentPropsWithRef, type ReactNode } from 'react';
export interface RadioOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}
/** 使用稳定 value 标识选项，label 作为组名称。 */
export interface RadioGroupProps extends Omit<ComponentPropsWithRef<'fieldset'>, 'onChange'> {
  label: ReactNode;
  options: RadioOption[];
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
}
/** 原生 radio 保留浏览器方向键和真实表单值。 */
export function RadioGroup({
  label,
  options,
  name,
  value,
  defaultValue = '',
  onValueChange,
  required,
  className = '',
  ...props
}: RadioGroupProps) {
  const id = useId();
  const [local, setLocal] = useState(defaultValue);
  const selected = value ?? local;
  return (
    <fieldset {...props} className={`aig-radio-group ${className}`}>
      <legend>{label}</legend>
      {options.map((option) => (
        <label key={option.value}>
          <input
            type="radio"
            name={name ?? id}
            value={option.value}
            disabled={option.disabled}
            required={required}
            checked={selected === option.value}
            onChange={() => {
              if (value === undefined) setLocal(option.value);
              onValueChange?.(option.value);
            }}
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
