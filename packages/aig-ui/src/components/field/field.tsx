'use client';
import { useId, type ReactNode, type ComponentPropsWithRef } from 'react';
/** 将稳定关联属性传给一个实际输入控件。 */
export interface FieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  required?: boolean;
}
export interface FieldProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: (props: FieldControlProps) => ReactNode;
}
/** 字段状态保留在宿主，输入内容保持原生语义。 */
export function Field({
  id: providedId,
  label,
  description,
  error,
  required,
  children,
  className = '',
  ...props
}: FieldProps) {
  const generated = useId();
  const id = providedId ?? generated;
  const descriptions =
    [description ? `${id}-description` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') ||
    undefined;
  return (
    <div {...props} className={`aig-field ${className}`}>
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden> *</span>}
      </label>
      {children({ id, 'aria-describedby': descriptions, 'aria-invalid': error ? true : undefined, required })}
      {description && (
        <div id={`${id}-description`} className="aig-field-description">
          {description}
        </div>
      )}
      {error && (
        <div id={`${id}-error`} className="aig-field-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
