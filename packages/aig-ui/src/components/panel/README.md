# Panel

Header、Body、Footer 组织内容，支持受约束容器内滚动。

从 `aig-ui/panel` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 panel.tsx，可编译示例见 panel.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

材料默认为 `glass`，通过 `material="solid"` 选择实色；Dialog/Drawer 的选项位于 Content。玻璃样式来自公共入口，包含 46px 模糊、渐变、高光和六层阴影。`AigProvider material="solid"` 提供统一实色偏好，系统强制颜色使用清晰边界。

视觉表现：面板用侧边短轨区分标题、正文和操作区，轨道上光点缓慢下巡、末端游标缓慢自转。自然布局和受限滚动继续生效。 动态装饰遵循系统减少动态效果偏好。
