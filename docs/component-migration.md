# 方案 2.0 组件迁移记录

更新日期：2026-09-12。基线 f28b89a，执行用户要求的全部组件重构，并加入更丰富的《底特律》式线条与动效。保留暖玫瑰品牌几何，增加低饱和冰蓝信号线。

本表记录源码迁移范围。样张由 Chromium 1280×720、DPR 1、系统字体生成，保存在 artifacts/design-review。静态采集使用 reduced-motion；完整动效由独立真实播放与受控退出检查验收。截图存在与用户视觉确认分别记录，当前视觉判定为部分符合，用户审阅后再冻结基准。

| 组件            | 改造内容                                               | 样张                                                       | 状态                                 |
| --------------- | ------------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------ |
| Button          | 操作底线、图标细线、标题标记、自然换行与焦点反馈       | [默认样张](../artifacts/design-review/Button.png)          | 部分符合；工程迁移已实施，视觉待确认 |
| IconButton      | 操作底线、图标细线、标题标记、自然换行与焦点反馈       | [默认样张](../artifacts/design-review/IconButton.png)      | 部分符合；工程迁移已实施，视觉待确认 |
| Link            | 操作底线、图标细线、标题标记、自然换行与焦点反馈       | [默认样张](../artifacts/design-review/Link.png)            | 部分符合；工程迁移已实施，视觉待确认 |
| Text            | 操作底线、图标细线、标题标记、自然换行与焦点反馈       | [默认样张](../artifacts/design-review/Text.png)            | 部分符合；工程迁移已实施，视觉待确认 |
| Heading         | 操作底线、图标细线、标题标记、自然换行与焦点反馈       | [默认样张](../artifacts/design-review/Heading.png)         | 部分符合；工程迁移已实施，视觉待确认 |
| Icon            | 操作底线、图标细线、标题标记、自然换行与焦点反馈       | [默认样张](../artifacts/design-review/Icon.png)            | 部分符合；工程迁移已实施，视觉待确认 |
| CopyButton      | 操作底线、图标细线、标题标记、自然换行与焦点反馈       | [默认样张](../artifacts/design-review/CopyButton.png)      | 部分符合；工程迁移已实施，视觉待确认 |
| Card            | 共享玻璃、边缘坐标、分段建立、弧线与显隐过渡           | [默认样张](../artifacts/design-review/Card.png)            | 部分符合；工程迁移已实施，视觉待确认 |
| Panel           | 共享玻璃、边缘坐标、分段建立、弧线与显隐过渡           | [默认样张](../artifacts/design-review/Panel.png)           | 部分符合；工程迁移已实施，视觉待确认 |
| Dialog          | 共享玻璃、边缘坐标、分段建立、弧线与显隐过渡           | [默认样张](../artifacts/design-review/Dialog.png)          | 部分符合；工程迁移已实施，视觉待确认 |
| Drawer          | 共享玻璃、边缘坐标、分段建立、弧线与显隐过渡           | [默认样张](../artifacts/design-review/Drawer.png)          | 部分符合；工程迁移已实施，视觉待确认 |
| Popover         | 共享玻璃、边缘坐标、分段建立、弧线与显隐过渡           | [默认样张](../artifacts/design-review/Popover.png)         | 部分符合；工程迁移已实施，视觉待确认 |
| Tooltip         | 共享玻璃、边缘坐标、分段建立、弧线与显隐过渡           | [默认样张](../artifacts/design-review/Tooltip.png)         | 部分符合；工程迁移已实施，视觉待确认 |
| DropdownMenu    | 共享玻璃、边缘坐标、分段建立、弧线与显隐过渡           | [默认样张](../artifacts/design-review/DropdownMenu.png)    | 部分符合；工程迁移已实施，视觉待确认 |
| Toast           | 共享玻璃、边缘坐标、分段建立、弧线与显隐过渡           | [默认样张](../artifacts/design-review/Toast.png)           | 部分符合；工程迁移已实施，视觉待确认 |
| Field           | 菱形标签、输入激活线、选择状态与稳定阅读底             | [默认样张](../artifacts/design-review/Field.png)           | 部分符合；工程迁移已实施，视觉待确认 |
| Input           | 菱形标签、输入激活线、选择状态与稳定阅读底             | [默认样张](../artifacts/design-review/Input.png)           | 部分符合；工程迁移已实施，视觉待确认 |
| Textarea        | 菱形标签、输入激活线、选择状态与稳定阅读底             | [默认样张](../artifacts/design-review/Textarea.png)        | 部分符合；工程迁移已实施，视觉待确认 |
| Checkbox        | 菱形标签、输入激活线、选择状态与稳定阅读底             | [默认样张](../artifacts/design-review/Checkbox.png)        | 部分符合；工程迁移已实施，视觉待确认 |
| RadioGroup      | 菱形标签、输入激活线、选择状态与稳定阅读底             | [默认样张](../artifacts/design-review/RadioGroup.png)      | 部分符合；工程迁移已实施，视觉待确认 |
| Switch          | 菱形标签、输入激活线、选择状态与稳定阅读底             | [默认样张](../artifacts/design-review/Switch.png)          | 部分符合；工程迁移已实施，视觉待确认 |
| Select          | 菱形标签、输入激活线、选择状态与稳定阅读底             | [默认样张](../artifacts/design-review/Select.png)          | 部分符合；工程迁移已实施，视觉待确认 |
| Combobox        | 菱形标签、输入激活线、选择状态与稳定阅读底             | [默认样张](../artifacts/design-review/Combobox.png)        | 部分符合；工程迁移已实施，视觉待确认 |
| Navigation      | 位置节点、短指示线、精密列线、等宽数字与区域滚动       | [默认样张](../artifacts/design-review/Navigation.png)      | 部分符合；工程迁移已实施，视觉待确认 |
| Tabs            | 位置节点、短指示线、精密列线、等宽数字与区域滚动       | [默认样张](../artifacts/design-review/Tabs.png)            | 部分符合；工程迁移已实施，视觉待确认 |
| Breadcrumb      | 位置节点、短指示线、精密列线、等宽数字与区域滚动       | [默认样张](../artifacts/design-review/Breadcrumb.png)      | 部分符合；工程迁移已实施，视觉待确认 |
| Pagination      | 位置节点、短指示线、精密列线、等宽数字与区域滚动       | [默认样张](../artifacts/design-review/Pagination.png)      | 部分符合；工程迁移已实施，视觉待确认 |
| Table           | 位置节点、短指示线、精密列线、等宽数字与区域滚动       | [默认样张](../artifacts/design-review/Table.png)           | 部分符合；工程迁移已实施，视觉待确认 |
| DescriptionList | 位置节点、短指示线、精密列线、等宽数字与区域滚动       | [默认样张](../artifacts/design-review/DescriptionList.png) | 部分符合；工程迁移已实施，视觉待确认 |
| Separator       | 位置节点、短指示线、精密列线、等宽数字与区域滚动       | [默认样张](../artifacts/design-review/Separator.png)       | 部分符合；工程迁移已实施，视觉待确认 |
| Accordion       | 位置节点、短指示线、精密列线、等宽数字与区域滚动       | [默认样张](../artifacts/design-review/Accordion.png)       | 部分符合；工程迁移已实施，视觉待确认 |
| PageHeader      | 位置节点、短指示线、精密列线、等宽数字与区域滚动       | [默认样张](../artifacts/design-review/PageHeader.png)      | 部分符合；工程迁移已实施，视觉待确认 |
| Badge           | 局部轨道、SVG 多层绘制、明确文字与静态结果             | [默认样张](../artifacts/design-review/Badge.png)           | 部分符合；工程迁移已实施，视觉待确认 |
| StatusIndicator | 局部轨道、SVG 多层绘制、明确文字与静态结果             | [默认样张](../artifacts/design-review/StatusIndicator.png) | 部分符合；工程迁移已实施，视觉待确认 |
| Spinner         | 局部轨道、SVG 多层绘制、明确文字与静态结果             | [默认样张](../artifacts/design-review/Spinner.png)         | 部分符合；工程迁移已实施，视觉待确认 |
| Progress        | 局部轨道、SVG 多层绘制、明确文字与静态结果             | [默认样张](../artifacts/design-review/Progress.png)        | 部分符合；工程迁移已实施，视觉待确认 |
| EmptyState      | 局部轨道、SVG 多层绘制、明确文字与静态结果             | [默认样张](../artifacts/design-review/EmptyState.png)      | 部分符合；工程迁移已实施，视觉待确认 |
| Result          | 局部轨道、SVG 多层绘制、明确文字与静态结果             | [默认样张](../artifacts/design-review/Result.png)          | 部分符合；工程迁移已实施，视觉待确认 |
| Alert           | 局部轨道、SVG 多层绘制、明确文字与静态结果             | [默认样张](../artifacts/design-review/Alert.png)           | 部分符合；工程迁移已实施，视觉待确认 |
| Skeleton        | 局部轨道、SVG 多层绘制、明确文字与静态结果             | [默认样张](../artifacts/design-review/Skeleton.png)        | 部分符合；工程迁移已实施，视觉待确认 |
| PromptInput     | 边缘轨迹、步骤连接、来源序号、版本和消息阅读层         | [默认样张](../artifacts/design-review/PromptInput.png)     | 部分符合；工程迁移已实施，视觉待确认 |
| Message         | 边缘轨迹、步骤连接、来源序号、版本和消息阅读层         | [默认样张](../artifacts/design-review/Message.png)         | 部分符合；工程迁移已实施，视觉待确认 |
| Conversation    | 边缘轨迹、步骤连接、来源序号、版本和消息阅读层         | [默认样张](../artifacts/design-review/Conversation.png)    | 部分符合；工程迁移已实施，视觉待确认 |
| SourceList      | 边缘轨迹、步骤连接、来源序号、版本和消息阅读层         | [默认样张](../artifacts/design-review/SourceList.png)      | 部分符合；工程迁移已实施，视觉待确认 |
| TaskStatus      | 边缘轨迹、步骤连接、来源序号、版本和消息阅读层         | [默认样张](../artifacts/design-review/TaskStatus.png)      | 部分符合；工程迁移已实施，视觉待确认 |
| ToolResult      | 边缘轨迹、步骤连接、来源序号、版本和消息阅读层         | [默认样张](../artifacts/design-review/ToolResult.png)      | 部分符合；工程迁移已实施，视觉待确认 |
| ArtifactPreview | 边缘轨迹、步骤连接、来源序号、版本和消息阅读层         | [默认样张](../artifacts/design-review/ArtifactPreview.png) | 部分符合；工程迁移已实施，视觉待确认 |
| Confirmation    | 边缘轨迹、步骤连接、来源序号、版本和消息阅读层         | [默认样张](../artifacts/design-review/Confirmation.png)    | 部分符合；工程迁移已实施，视觉待确认 |
| LoadingMark     | 原型描边、双环重量、光晕、撤回缓动                     | [默认样张](../artifacts/design-review/LoadingMark.png)     | 部分符合；工程迁移已实施，视觉待确认 |
| LoadingSequence | 统一演示时钟、标签独立退出、实际描边交接、全屏表面消散 | [退出 450ms](../artifacts/design-review/exit-450.png)      | 部分符合；工程迁移已实施，视觉待确认 |

五个页面组合均使用公共环境层：访问状态、设置表单、资料列表、AI 助手与产物审核。其模拟交互仍由既有 Story 提供。

## 兼容变化

- Card 与 AigProvider 的默认材料由 solid 改为 glass；Panel、Dialog.Content 新增同名材料选项，Drawer.Content 自动继承。旧实色外观可显式传 material="solid"。
- LoadingMark 默认尺寸由 112 改为 clamp(88px, 13vh, 118px)，固定尺寸继续通过 size 传入。
- 完整加载退出约 2130ms，交接由 Animation.finished 汇合；onExited 表示内容进入完成。
- 新增 aig-ui/design.md 视觉资料出口，manifest.designRef 与 llms 索引指向同批资料。

## 验证与回退

运行根目录 pnpm check、浏览器矩阵及独立消费构建。按组件族独立提交，使用 git revert 对应提交回退；共享样式和 Token 回退时同时检查依赖组件。原始 reference 文件保持原样。

**用户视觉确认**决定科幻强度与线条密度的最终基准；**辅助技术与真实设备**验证继续作为正式发布条件。当前工程检查覆盖本地 Chromium 和消费示例，真实 Safari/iOS、NVDA/VoiceOver、业务试点及真实模型评估单独记录。
