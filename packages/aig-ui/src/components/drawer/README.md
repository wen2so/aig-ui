# Drawer

复用对话框的焦点与关闭行为，在侧边展示详情与操作。

从 `aig-ui/drawer` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 drawer.tsx，可编译示例见 drawer.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

材料默认为 `glass`，通过 `material="solid"` 选择实色；Dialog/Drawer 的选项位于 Content。玻璃样式来自公共入口，包含 46px 模糊、渐变、高光和六层阴影。`AigProvider material="solid"` 提供统一实色偏好，系统强制颜色使用清晰边界。

方案 2.0 线框视觉：继承 Dialog 的玻璃表面与玫瑰刻线。公共样式保留键盘、禁用、错误和长文本的适用行为；静态文字采用自然字距，动态装饰遵循系统减少动态效果设置。
