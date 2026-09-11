'use client';
import { Select as BaseSelect } from '@base-ui/react/select';
import type { ComponentPropsWithRef } from 'react';
import { useAigPortalContainer } from '../../theme/aig-provider.js';
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
/** 使用稳定字符串值，label 为触发器的可访问名称。 */
export interface SelectProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'value' | 'defaultValue' | 'children' | 'onChange'
> {
  options: SelectOption[];
  label: string;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  required?: boolean;
}
/** 选择状态由 Base UI 管理，异步选项和业务请求由宿主提供。 */
export function Select({
  options,
  label,
  value,
  defaultValue,
  onValueChange,
  placeholder = '请选择',
  name,
  form,
  required,
  disabled,
  className = '',
  ...props
}: SelectProps) {
  const container = useAigPortalContainer();
  return (
    <BaseSelect.Root<string>
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      items={options}
      name={name}
      form={form}
      required={required}
      disabled={disabled}
    >
      <BaseSelect.Trigger {...props} aria-label={label} className={`aig-select-trigger ${className}`}>
        <BaseSelect.Value>
          {(selected: string | null) =>
            selected === null
              ? placeholder
              : (options.find((option) => option.value === selected)?.label ?? `${selected}（已不可用）`)
          }
        </BaseSelect.Value>
        <BaseSelect.Icon aria-hidden>⌄</BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal container={container}>
        <BaseSelect.Positioner sideOffset={6} alignItemWithTrigger={false} className="aig-select-positioner">
          <BaseSelect.Popup className="aig-select-popup">
            <BaseSelect.List>
              {options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="aig-select-item"
                >
                  <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator aria-hidden>✓</BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
            {options.length === 0 && <p role="status">暂无可选内容</p>}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
