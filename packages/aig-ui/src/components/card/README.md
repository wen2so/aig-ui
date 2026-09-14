# Card

自然伸展的内容表面，支持实色与柔和玻璃材质。

从 `aig-ui/card` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 card.tsx，可编译示例见 card.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

材料默认为 `glass`，通过 `material="solid"` 选择实色；Dialog/Drawer 的选项位于 Content。玻璃样式来自公共入口，包含 46px 模糊、渐变、高光和六层阴影。`AigProvider material="solid"` 提供统一实色偏好，系统强制颜色使用清晰边界。

视觉表现：玻璃或实色表面配合完整边界，内容获得焦点时建立一条短线，保持阅读空间。动态效果遵循系统减少动态效果偏好。
