# Combobox

输入文字检索单选项，保留键盘选择、无结果提示与真实表单值。

从 `aig-ui/combobox` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 combobox.tsx，可编译示例见 combobox.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：检索框保留完整边界，聚焦时建立基线，选项侧线定位当前结果。动态效果遵循系统减少动态效果偏好。

按 `options` 引用建立值索引与规范化搜索标签，过滤和渲染使用索引读取，避免为每个候选重复遍历选项数组。更新选项时传入新的数组。
