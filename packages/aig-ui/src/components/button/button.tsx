import type { ComponentPropsWithRef } from 'react';

/** 执行动作的原生按钮。 */
export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** 操作层级，默认 primary。 */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** 控件尺寸，默认 md。 */
  size?: 'sm' | 'md' | 'lg';
  /** 保留名称和尺寸，并禁用重复激活。 */
  loading?: boolean;
}

/** 保留表单、键盘、ref 和可访问名称的按钮。 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  type = 'button',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-aig-component="button"
      data-variant={variant}
      data-size={size}
      className={`aig-button ${className}`}
    >
      {loading && <span className="aig-button-busy" aria-hidden="true" />}
      {children}
    </button>
  );
}
