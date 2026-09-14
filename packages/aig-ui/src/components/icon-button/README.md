# IconButton

具有必需可访问名称的图标操作按钮。

从 `aig-ui/icon-button` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 icon-button.tsx，可编译示例见 icon-button.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：正方形操作区承载居中的操作图标，复用 Button 的矩形边框与状态反馈，但不参与三角碎片入场——横向的碎片在方形按钮上会被压成细条。悬停时边框扩展并扫描基线，按压时外框收拢，图标的位置保持稳定。`aria-pressed` 表达切换动作，激活后保留选中底边，示例中的收藏动作提供真实状态反馈。

静止保留基线巡行，禁用保持静态，加载使用专用图标与扫描反馈，原生禁用、键盘和加载行为保持一致。`loadingIcon` 支持局部自定义 SVG，加载时在中心替换原图标并保持尺寸。IconButton 使用单一图标内容；文字操作的前后图标槽位由 Button 提供。动态装饰遵循系统减少动态效果偏好。
