'use client';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import type { ComponentProps } from 'react';
import { classNames } from '../../internal/class-name.js';
/** 一个独立的信息项。 */
function Item({ className, ...props }: ComponentProps<typeof BaseAccordion.Item>) {
  return <BaseAccordion.Item {...props} className={classNames('aig-accordion-item', className)} />;
}
/** 触发器放在 Header 内，保留展开状态。 */
function Trigger({ className, ...props }: ComponentProps<typeof BaseAccordion.Trigger>) {
  return <BaseAccordion.Trigger {...props} className={classNames('aig-accordion-trigger', className)} />;
}
/** 展开的补充内容。 */
function Panel({ className, ...props }: ComponentProps<typeof BaseAccordion.Panel>) {
  return <BaseAccordion.Panel {...props} className={classNames('aig-accordion-panel', className)} />;
}
/** Root 使用 value/defaultValue 数组控制已展开条目。 */
export const Accordion = { Root: BaseAccordion.Root, Item, Header: BaseAccordion.Header, Trigger, Panel };
