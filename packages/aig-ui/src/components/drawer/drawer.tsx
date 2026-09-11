'use client';
import type { ComponentProps } from 'react';
import { Dialog } from '../dialog/dialog.js';
import { classNames } from '../../internal/class-name.js';
/** 侧边抽屉，默认从右侧出现。 */
function Content({
  side = 'right',
  className,
  ...props
}: ComponentProps<typeof Dialog.Content> & { side?: 'left' | 'right' }) {
  return <Dialog.Content {...props} data-side={side} className={classNames('aig-drawer', className)} />;
}
/** 与 Dialog 共用 Root/Trigger/Title/Description/Actions/Close。 */
export const Drawer = { ...Dialog, Content };
