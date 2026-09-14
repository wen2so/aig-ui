'use client';
import { X } from 'lucide-react';
import { Icon } from '../icon/icon.js';
import { Toast as BaseToast } from '@base-ui/react/toast';
import type { ComponentProps } from 'react';
import { useAigPortalContainer } from '../../theme/aig-provider.js';
/** 渲染当前 Provider 中的短时消息。 */
function Viewport() {
  const { toasts } = BaseToast.useToastManager();
  const container = useAigPortalContainer();
  return (
    <BaseToast.Portal container={container}>
      <BaseToast.Viewport className="aig-toast-viewport" aria-label="消息提示">
        {toasts.map((toast) => (
          <BaseToast.Root key={toast.id} toast={toast} className="aig-toast">
            <BaseToast.Content>
              <BaseToast.Title className="aig-toast-title" />
              <BaseToast.Description className="aig-toast-description" />
            </BaseToast.Content>
            <BaseToast.Close className="aig-toast-close" aria-hidden={false} aria-label="关闭提示">
              <Icon icon={X} size={16} />
            </BaseToast.Close>
          </BaseToast.Root>
        ))}
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
}
/** 在应用根部提供 Toast 状态和固定展示区域。 */
function Provider({ children, ...props }: ComponentProps<typeof BaseToast.Provider>) {
  return (
    <BaseToast.Provider {...props}>
      {children}
      <Viewport />
    </BaseToast.Provider>
  );
}
/** useManager 在 Provider 的子组件中调用，支持 add、update、close。 */
export const Toast = { Provider, useManager: BaseToast.useToastManager };
