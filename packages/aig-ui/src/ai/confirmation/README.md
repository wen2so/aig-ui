# Confirmation

绑定产物与具体版本，明确影响，阻止重复提交并处理失败与版本冲突。

从 `aig-ui/ai/confirmation` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 confirmation.tsx，可编译示例见 confirmation.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

方案 2.2 线框视觉：玻璃确认面 + 左侧状态轨（带缓慢下巡光点），操作使用线框按钮。公共样式保留键盘、禁用、错误和长文本的适用行为；静态文字采用自然字距，动态装饰遵循系统减少动态效果设置。
