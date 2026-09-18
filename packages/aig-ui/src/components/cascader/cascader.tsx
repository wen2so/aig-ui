'use client';
import { useMemo, useState, type ComponentPropsWithRef } from 'react';
import { Button } from '../button/button.js';
import { Popover } from '../popover/popover.js';
import { indexTree, type TreeNode } from '../../internal/tree-data.js';
import { useControllableValue } from '../../internal/use-controllable-value.js';
export interface CascaderProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue'> {
  label: string;
  options: TreeNode[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  name?: string;
  form?: string;
}
/** 按路径逐级浏览，选择叶节点后提交完整 ID 路径。 */
export function Cascader({
  label,
  options,
  value,
  defaultValue = [],
  onValueChange,
  disabled = false,
  name,
  form,
  className = '',
  ...props
}: CascaderProps) {
  const [selected, setSelected] = useControllableValue(value, defaultValue, onValueChange);
  const [draft, setDraft] = useState(selected);
  const [open, setOpen] = useState(false);
  const paths = useMemo(() => indexTree(options), [options]);
  const selectedPath = selected.length ? paths.get(selected.at(-1)!) : undefined;
  const valid = selectedPath?.map((node) => node.id).join('\0') === selected.join('\0');
  const columns: TreeNode[][] = [options];
  let children = options;
  for (const id of draft) {
    const node = children.find((item) => item.id === id);
    if (!node?.children?.length || node.disabled) break;
    children = node.children;
    columns.push(children);
  }
  return (
    <div {...props} className={`aig-cascader ${className}`}>
      <input type="hidden" name={name} form={form} disabled={disabled} value={JSON.stringify(selected)} />
      <Popover.Root
        open={open && !disabled}
        onOpenChange={(next) => {
          if (next) setDraft(selected);
          setOpen(next);
        }}
      >
        <Popover.Trigger render={<Button variant="outline" disabled={disabled} aria-label={label} />}>
          {selected.length
            ? valid
              ? selectedPath!.map((node) => node.label).join(' / ')
              : '已选路径不可用'
            : '请选择路径'}
        </Popover.Trigger>
        <Popover.Content className="aig-cascader-popup">
          <Popover.Title>{label}</Popover.Title>
          <div className="aig-cascader-columns">
            {columns.map((nodes, level) => (
              <div key={level} className="aig-cascader-column" role="group" aria-label={`第 ${level + 1} 级`}>
                {nodes.map((node) => (
                  <Button
                    key={node.id}
                    size="sm"
                    entrance={false}
                    variant="ghost"
                    disabled={node.disabled}
                    aria-pressed={draft[level] === node.id}
                    onClick={() => {
                      const next = [...draft.slice(0, level), node.id];
                      setDraft(next);
                      if (!node.children?.length) {
                        setSelected(next);
                        setOpen(false);
                      }
                    }}
                  >
                    {node.label}
                    {node.children?.length ? ' ›' : ''}
                  </Button>
                ))}
              </div>
            ))}
          </div>
          {!options.length && <p>暂无选项</p>}
          {selected.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelected([]);
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
