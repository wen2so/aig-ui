# TaskStatus

表达排队、执行、待确认、完成、失败和取消等真实任务状态。

从 `aig-ui/ai/task-status` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 task-status.tsx，可编译示例见 task-status.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：步骤节点与连接线表达进度，进行中启用轨道扫描与末步旋转。动态效果遵循系统减少动态效果偏好。
