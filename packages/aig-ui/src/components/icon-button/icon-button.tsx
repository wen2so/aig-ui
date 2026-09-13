import { Button, type ButtonProps } from '../button/button.js';
/** 以 aria-label 为图标按钮提供名称。 */
export interface IconButtonProps extends Omit<ButtonProps, 'aria-label' | 'leadingIcon' | 'trailingIcon'> {
  'aria-label': string;
}
/** 保留 Button 的加载、键盘和尺寸行为。 */
export function IconButton({ className = '', loading, children, ...props }: IconButtonProps) {
  return (
    <Button {...props} loading={loading} className={`aig-icon-button ${className}`}>
      {loading ? null : children}
    </Button>
  );
}
