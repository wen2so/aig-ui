'use client';
import { useId, useImperativeHandle, useMemo, useRef, useState, type ComponentPropsWithRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { Icon } from '../icon/icon.js';
import { indexTree, type TreeNode } from '../../internal/tree-data.js';
import { useControllableValue } from '../../internal/use-controllable-value.js';
export type { TreeNode } from '../../internal/tree-data.js';
export interface TreeProps extends Omit<ComponentPropsWithRef<'div'>, 'onSelect' | 'defaultValue'> {
  nodes: TreeNode[];
  label: string;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** 层级选择器可限制仅叶节点可选；树本身默认允许选择父节点。 */ leafOnly?: boolean;
}
/** 焦点与选择分离；方向键浏览、左右展开收起，Enter 或空格选择。 */
export function Tree({
  nodes,
  label,
  value,
  defaultValue = null,
  onValueChange,
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  leafOnly = false,
  className = '',
  onKeyDown,
  ref: forwardedRef,
  ...props
}: TreeProps) {
  const [selected, setSelected] = useControllableValue<string | null>(value, defaultValue, (next) => {
    if (next !== null) onValueChange?.(next);
  });
  const [expanded, setExpanded] = useControllableValue(expandedIds, defaultExpandedIds, onExpandedChange);
  const [active, setActive] = useState<string | null>(null);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  useImperativeHandle(forwardedRef, () => root.current!, []);
  const search = useRef({ value: '', time: 0 });
  const paths = useMemo(() => indexTree(nodes), [nodes]);
  const flat: { node: TreeNode; parent?: string; disabled: boolean }[] = [];
  function flatten(items: TreeNode[], parent?: string, disabled = false) {
    items.forEach((node) => {
      const unavailable = disabled || Boolean(node.disabled);
      flat.push({ node, parent, disabled: unavailable });
      if (expanded.includes(node.id)) flatten(node.children ?? [], node.id, unavailable);
    });
  }
  flatten(nodes);
  const activeId =
    flat.find((item) => item.node.id === active)?.node.id ??
    flat.find((item) => item.node.id === selected)?.node.id ??
    flat[0]?.node.id;
  const domIds = useMemo(
    () => new Map(Array.from(paths.keys(), (key, index) => [key, `${id}-${index}`])),
    [paths, id],
  );
  const domId = (nodeId: string) => domIds.get(nodeId)!;
  const toggle = (nodeId: string, open: boolean) =>
    setExpanded(open ? [...new Set([...expanded, nodeId])] : expanded.filter((value) => value !== nodeId));
  const select = (node: TreeNode, disabled: boolean) => {
    if (!disabled && (!leafOnly || !node.children?.length)) setSelected(node.id);
  };
  function renderNodes(items: TreeNode[], level = 1, disabled = false) {
    return items.map((node, index) => {
      const branch = Boolean(node.children?.length);
      const open = expanded.includes(node.id);
      const unavailable = disabled || Boolean(node.disabled);
      return (
        <div
          key={node.id}
          id={domId(node.id)}
          role="treeitem"
          aria-label={node.label}
          aria-level={level}
          aria-posinset={index + 1}
          aria-setsize={items.length}
          aria-expanded={branch ? open : undefined}
          aria-selected={leafOnly && branch ? undefined : selected === node.id}
          aria-disabled={unavailable || undefined}
        >
          <div
            role="presentation"
            className="aig-tree-row"
            data-active={activeId === node.id || undefined}
            data-selected={selected === node.id || undefined}
            style={{ paddingInlineStart: 10 + (level - 1) * 20 }}
            onClick={() => {
              setActive(node.id);
              root.current?.focus();
              if (leafOnly && branch && !unavailable) toggle(node.id, !open);
              else select(node, unavailable);
            }}
          >
            <span
              className="aig-tree-toggle"
              data-open={open || undefined}
              aria-hidden="true"
              onClick={(event) => {
                if (!branch) return;
                event.stopPropagation();
                setActive(node.id);
                root.current?.focus();
                if (!unavailable) toggle(node.id, !open);
              }}
            >
              {branch && <Icon icon={ChevronRight} size={14} />}
            </span>
            <span>{node.label}</span>
          </div>
          {branch && open && <div role="group">{renderNodes(node.children!, level + 1, unavailable)}</div>}
        </div>
      );
    });
  }
  return (
    <div
      {...props}
      ref={root}
      role="tree"
      tabIndex={0}
      aria-label={label}
      aria-activedescendant={activeId ? domId(activeId) : undefined}
      className={`aig-tree ${className}`}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || !flat.length) return;
        const position = Math.max(
          0,
          flat.findIndex((item) => item.node.id === activeId),
        );
        const item = flat[position]!;
        let next: string | undefined;
        if (event.key === 'ArrowDown') next = flat[Math.min(flat.length - 1, position + 1)]!.node.id;
        else if (event.key === 'ArrowUp') next = flat[Math.max(0, position - 1)]!.node.id;
        else if (event.key === 'Home') next = flat[0]!.node.id;
        else if (event.key === 'End') next = flat.at(-1)!.node.id;
        else if (event.key === 'ArrowRight') {
          if (item.node.children?.length && !item.disabled) {
            if (!expanded.includes(item.node.id)) toggle(item.node.id, true);
            else next = item.node.children[0]!.id;
          }
        } else if (event.key === 'ArrowLeft') {
          if (expanded.includes(item.node.id)) toggle(item.node.id, false);
          else next = item.parent;
        } else if (event.key === 'Enter' || event.key === ' ') {
          if (leafOnly && item.node.children?.length && !item.disabled)
            toggle(item.node.id, !expanded.includes(item.node.id));
          else select(item.node, item.disabled);
        } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const now = Date.now();
          search.current = {
            value:
              (now - search.current.time < 700 ? search.current.value : '') + event.key.toLocaleLowerCase(),
            time: now,
          };
          const ordered = [...flat.slice(position + 1), ...flat.slice(0, position + 1)];
          next = ordered.find((entry) =>
            entry.node.label.toLocaleLowerCase().startsWith(search.current.value),
          )?.node.id;
        } else return;
        event.preventDefault();
        if (next) {
          setActive(next);
          document.getElementById(domId(next))?.scrollIntoView?.({ block: 'nearest' });
        }
      }}
    >
      {nodes.length ? renderNodes(nodes) : <span className="aig-tree-empty">暂无选项</span>}
    </div>
  );
}
