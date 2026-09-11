'use client';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps, ComponentPropsWithRef } from 'react';
import { classNames } from '../../internal/class-name.js';
import { useAigPortalContainer } from '../../theme/aig-provider.js';
/** Content 包含 Portal 与背景，Title 用于提供可访问名称。 */
function Content({ className, ...props }: ComponentProps<typeof BaseDialog.Popup>) {
  const container = useAigPortalContainer();
  return (
    <BaseDialog.Portal container={container}>
      <BaseDialog.Backdrop className="aig-dialog-backdrop" />
      <BaseDialog.Popup {...props} className={classNames('aig-dialog', className)} />
    </BaseDialog.Portal>
  );
}
/** 对话框标题。 */
function Title({ className, ...props }: ComponentProps<typeof BaseDialog.Title>) {
  return <BaseDialog.Title {...props} className={classNames('aig-dialog-title', className)} />;
}
/** 对话框用途说明。 */
function Description({ className, ...props }: ComponentProps<typeof BaseDialog.Description>) {
  return <BaseDialog.Description {...props} className={classNames('aig-dialog-description', className)} />;
}
/** 操作区域按可用宽度自然换行。 */
function Actions({ className = '', ...props }: ComponentPropsWithRef<'div'>) {
  return <div {...props} className={`aig-dialog-actions ${className}`} />;
}
/** Root 负责受控开关，Trigger/Close 支持 Base UI render 组合。 */
export const Dialog = {
  Root: BaseDialog.Root,
  Trigger: BaseDialog.Trigger,
  Content,
  Title,
  Description,
  Actions,
  Close: BaseDialog.Close,
};
