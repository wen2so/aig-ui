'use client';
import { useMemo, useState, type ComponentPropsWithRef } from 'react';
import { Popover } from '../popover/popover.js';
import { Button } from '../button/button.js';
import { Tree, type TreeNode } from '../tree/tree.js';
import { indexTree } from '../../internal/tree-data.js';
import { useControllableValue } from '../../internal/use-controllable-value.js';
export interface TreeSelectProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue'> {
  label: string;
  nodes: TreeNode[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  disabled?: boolean;
  name?: string;
  form?: string;
  leafOnly?: boolean;
  placeholder?: string;
}
/** 选择真实节点 ID，完整路径作为可读标签；失效选项明确展示并允许清除。 */
export function TreeSelect({
  label,
  nodes,
  value,
  defaultValue = null,
  onValueChange,
  disabled = false,
  name,
  form,
  leafOnly = false,
  placeholder = '请选择',
  className = '',
  ...props
}: TreeSelectProps) {
  const [selected, setSelected] = useControllableValue(value, defaultValue, onValueChange);
  const [open, setOpen] = useState(false);
  const paths = useMemo(() => indexTree(nodes), [nodes]);
  const path = selected ? paths.get(selected) : undefined;
  return (
    <div {...props} className={`aig-tree-select ${className}`}>
      <input type="hidden" name={name} form={form} disabled={disabled} value={selected ?? ''} />
      <Popover.Root open={open && !disabled} onOpenChange={setOpen}>
        <Popover.Trigger
          render={
            <Button
              variant="outline"
              disabled={disabled}
              aria-label={`${label}：${path?.map((node) => node.label).join(' / ') ?? (selected ? '选项已不可用' : placeholder)}`}
            />
          }
        >
          {path?.map((node) => node.label).join(' / ') ??
            (selected ? `${selected}（已不可用）` : placeholder)}
        </Popover.Trigger>
        <Popover.Content className="aig-tree-select-popup">
          <Popover.Title>{label}</Popover.Title>
          <Tree
            key={selected ?? 'empty'}
            label={label}
            nodes={nodes}
            value={selected}
            leafOnly={leafOnly}
            defaultExpandedIds={path?.slice(0, -1).map((node) => node.id)}
            onValueChange={(next) => {
              setSelected(next);
              setOpen(false);
            }}
          />
          {selected && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelected(null);
                setOpen(false);
              }}
            >
              清除选择
            </Button>
          )}
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
