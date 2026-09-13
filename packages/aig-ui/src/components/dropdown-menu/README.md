# DropdownMenu

可用方向键选择的操作列表，支持禁用项与关闭恢复焦点。

从 `aig-ui/dropdown-menu` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 dropdown-menu.tsx，可编译示例见 dropdown-menu.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

方案 2.2 线框视觉：玻璃仪器面板（四角括线与顶边巡航光点）；高亮项带左侧玫瑰刻度与极淡玫瑰底。公共样式保留键盘、禁用、错误和长文本的适用行为；静态文字采用自然字距，动态装饰遵循系统减少动态效果设置。
