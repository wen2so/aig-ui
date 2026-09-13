# Dialog

以可组合部件提供模态焦点管理、键盘关闭与主题内浮层。

从 `aig-ui/dialog` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 dialog.tsx，可编译示例见 dialog.stories.tsx。

Root 使用 open/defaultOpen/onOpenChange。Content 内提供 Title；Trigger 与 Close 通过 render 组合 Button。Tab 限于模态区域，Escape 关闭并恢复焦点。AigProvider 管理嵌套主题和 Portal 归属。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

材料默认为 `glass`，通过 `material="solid"` 选择实色；Dialog/Drawer 的选项位于 Content。玻璃样式来自公共入口，包含 46px 模糊、渐变、高光和六层阴影。`AigProvider material="solid"` 提供统一实色偏好，系统强制颜色使用清晰边界。

视觉表现：对话框采用顶部中轴刻线（带缓慢巡航光点）与底部对位短线。玻璃材质、焦点锁定、Escape 关闭和触发器焦点恢复继续生效。 动态装饰遵循系统减少动态效果偏好。
