import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Button } from '../button/button.js';
export interface StepItem {
  id: string;
  title: string;
  description?: ReactNode;
  status?: 'waiting' | 'current' | 'complete' | 'error';
  disabled?: boolean;
}
export interface StepsProps extends ComponentPropsWithRef<'ol'> {
  items: StepItem[];
  current?: number;
  onStepChange?: (index: number) => void;
  orientation?: 'horizontal' | 'vertical';
}
/** 步骤状态与实际流程一致；只有提供回调时才允许切换。 */
export function Steps({
  items,
  current = 0,
  onStepChange,
  orientation = 'horizontal',
  className = '',
  ...props
}: StepsProps) {
  return (
    <ol aria-label="操作步骤" {...props} className={`aig-steps ${className}`} data-orientation={orientation}>
      {items.map((item, index) => {
        const state =
          item.status ?? (index < current ? 'complete' : index === current ? 'current' : 'waiting');
        return (
          <li key={item.id} data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
            <span
              className="aig-step-number"
              aria-label={
                { waiting: '待开始', current: '当前步骤', complete: '已完成', error: '未完成' }[state]
              }
            >
              {index + 1}
            </span>
            <div>
              {onStepChange ? (
                <Button
                  variant="ghost"
                  entrance={false}
                  disabled={item.disabled}
                  onClick={() => onStepChange(index)}
                >
                  {item.title}
                </Button>
              ) : (
                <strong>{item.title}</strong>
              )}
              {item.description && <p>{item.description}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
