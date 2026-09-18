'use client';
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- WAI-ARIA 可调 separator 以范围属性和键盘操作提供交互。 */
import { useId, useRef, type ComponentPropsWithRef, type ReactNode } from 'react';
import { useControllableValue } from '../../internal/use-controllable-value.js';
export interface SplitterProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'onChange' | 'defaultValue'
> {
  first: ReactNode;
  second: ReactNode;
  label: string;
  orientation?: 'horizontal' | 'vertical';
  /** 第一面板占可用空间的百分比。 */ value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  onValueChange?: (value: number) => void;
}
/** 指针与键盘共用百分比边界，拖动结束后释放指针捕获。 */
export function Splitter({
  first,
  second,
  label,
  orientation = 'horizontal',
  value,
  defaultValue = 40,
  min = 15,
  max = 85,
  onValueChange,
  className = '',
  style,
  ...props
}: SplitterProps) {
  const [position, setPosition] = useControllableValue(value, defaultValue, onValueChange);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const lower = Math.min(100, Math.max(0, Number.isFinite(min) ? min : 15));
  const upper = Math.min(100, Math.max(lower, Number.isFinite(max) ? max : 85));
  const clamp = (n: number) => Math.max(lower, Math.min(upper, Number.isFinite(n) ? n : 40));
  const current = clamp(position);
  const vertical = orientation === 'vertical';
  return (
    <div
      {...props}
      ref={root}
      className={`aig-splitter ${className}`}
      data-orientation={orientation}
      style={{
        [vertical ? 'gridTemplateRows' : 'gridTemplateColumns']:
          `minmax(0,${current}fr) 12px minmax(0,${100 - current}fr)`,
        ...style,
      }}
    >
      <div id={id} className="aig-splitter-panel">
        {first}
      </div>
      <div
        role="separator"
        tabIndex={0}
        aria-label={label}
        aria-controls={id}
        aria-orientation={vertical ? 'horizontal' : 'vertical'}
        aria-valuemin={lower}
        aria-valuemax={upper}
        aria-valuenow={Math.round(current)}
        className="aig-splitter-handle"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.currentTarget.focus();
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId) || !root.current) return;
          const rect = root.current.getBoundingClientRect();
          const length = (vertical ? rect.height : rect.width) - 12;
          if (length > 0)
            setPosition(
              clamp((((vertical ? event.clientY - rect.top : event.clientX - rect.left) - 6) / length) * 100),
            );
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onKeyDown={(event) => {
          const minus = vertical ? 'ArrowUp' : 'ArrowLeft';
          const plus = vertical ? 'ArrowDown' : 'ArrowRight';
          if (![minus, plus, 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          setPosition(
            event.key === 'Home'
              ? lower
              : event.key === 'End'
                ? upper
                : clamp(current + (event.key === plus ? 1 : -1) * (event.shiftKey ? 10 : 2)),
          );
        }}
      />
      <div className="aig-splitter-panel">{second}</div>
    </div>
  );
}
