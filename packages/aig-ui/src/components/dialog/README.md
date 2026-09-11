# Dialog

以可组合部件提供模态焦点管理、键盘关闭与主题内浮层。

从 `aig-ui/dialog` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 dialog.tsx，可编译示例见 dialog.stories.tsx。

Root 使用 open/defaultOpen/onOpenChange。Content 内提供 Title；Trigger 与 Close 通过 render 组合 Button。Tab 限于模态区域，Escape 关闭并恢复焦点。AigProvider 管理嵌套主题和 Portal 归属。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。
