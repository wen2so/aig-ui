'use client';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ComponentProps } from 'react';
import { classNames } from '../../internal/class-name.js';
import { useAigPortalContainer } from '../../theme/aig-provider.js';
/** Tooltip 只承载简短说明，操作内容使用 Popover。 */
function Content({ className, ...props }: ComponentProps<typeof BaseTooltip.Popup>) {
  const container = useAigPortalContainer();
  return (
    <BaseTooltip.Portal container={container}>
      <BaseTooltip.Positioner sideOffset={8} className="aig-tooltip-positioner">
        <BaseTooltip.Popup {...props} className={classNames('aig-tooltip', className)} />
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}
/** Provider 控制提示延迟，Trigger 保留原有可访问名称。 */
export const Tooltip = {
  Provider: BaseTooltip.Provider,
  Root: BaseTooltip.Root,
  Trigger: BaseTooltip.Trigger,
  Content,
};
