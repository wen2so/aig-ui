# TaskStatus

表达排队、执行、待确认、完成、失败和取消等真实任务状态。

从 `aig-ui/ai/task-status` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 task-status.tsx，可编译示例见 task-status.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

方案 2.2 线框视觉：玫瑰连接线带缓慢下巡光轨与菱形步骤节点，末步节点自转表示进行中。公共样式保留键盘、禁用、错误和长文本的适用行为；静态文字采用自然字距，动态装饰遵循系统减少动态效果设置。
