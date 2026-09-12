# Button

用于提交、确认和普通操作。默认 `variant="primary"`、`size="md"`、`type="button"`；提交表单时显式设置 `type="submit"`。加载时保留文本并禁用激活，业务应用负责请求幂等。

从 `aig-ui/button` 导入 Button，并在宿主导入 `aig-ui/styles.css`。完整类型见 button.tsx，可编译示例见 button.stories.tsx。支持原生属性、ref、Enter、Space 和可见焦点。颜色通过 `--aig-color-accent` 等语义 Token 覆盖。

当前版本为实验性 alpha，浏览器及消费验收记录见仓库 docs/progress.md。

方案 2.0 视觉：操作底线、图标细线、标题标记、自然换行与焦点反馈。公共样式保留键盘、禁用、错误和长文本的适用行为；静态文字采用自然字距，动态装饰遵循系统减少动态效果设置。
