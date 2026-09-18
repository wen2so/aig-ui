export interface TreeNode {
  /** 整棵树内唯一标识。 */ id: string;
  label: string;
  disabled?: boolean;
  children?: TreeNode[];
}
/** 路径索引用于层级选择和名称展示，避免把标签作为提交值。 */
export function indexTree(
  nodes: TreeNode[],
  parents: TreeNode[] = [],
  result = new Map<string, TreeNode[]>(),
) {
  for (const node of nodes) {
    if (result.has(node.id)) throw new Error(`树节点标识重复：${node.id}`);
    const path = [...parents, node];
    result.set(node.id, path);
    if (node.children?.length) indexTree(node.children, path, result);
  }
  return result;
}
