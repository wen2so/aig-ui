'use client';
import { ChevronDown } from 'lucide-react';
import { Icon } from '../icon/icon.js';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import type { ComponentProps } from 'react';
import { classNames } from '../../internal/class-name.js';
/** 一个独立的信息项。 */
function Item({ className, ...props }: ComponentProps<typeof BaseAccordion.Item>) {
  return <BaseAccordion.Item {...props} className={classNames('aig-accordion-item', className)} />;
}
/** 触发器放在 Header 内，保留展开状态。 */
function Trigger({ className, children, ...props }: ComponentProps<typeof BaseAccordion.Trigger>) {
  return (
    <BaseAccordion.Trigger {...props} className={classNames('aig-accordion-trigger', className)}>
      {children}
      <Icon icon={ChevronDown} size={16} className="aig-accordion-chevron" />
    </BaseAccordion.Trigger>
  );
}
/** 展开的补充内容。 */
function Panel({ className, children, ...props }: ComponentProps<typeof BaseAccordion.Panel>) {
  return (
    <BaseAccordion.Panel {...props} className={classNames('aig-accordion-panel', className)}>
      <div className="aig-accordion-content">{children}</div>
    </BaseAccordion.Panel>
  );
}
/** Root 使用 value/defaultValue 数组控制已展开条目。 */
export const Accordion = { Root: BaseAccordion.Root, Item, Header: BaseAccordion.Header, Trigger, Panel };
