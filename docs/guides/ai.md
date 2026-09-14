# AI 交互

AI 组件负责展示与交互，宿主负责模型服务、业务请求、权限和数据版本。

```tsx
import { TaskStatus } from 'aig-ui/ai';
import 'aig-ui/styles.css';
import 'aig-ui/ai/styles.css';

<TaskStatus status="running" summary="正在整理资料" steps={['读取文件', '生成摘要']} />;
```

## 组件职责

| 组件            | 当前行为与宿主职责                                                                        |
| --------------- | ----------------------------------------------------------------------------------------- |
| Message         | 展示消息与安全 Markdown；宿主提供累积文本和对应状态                                       |
| Conversation    | 底部附近跟随更新，向上阅读时保留位置并提示新内容；首尾消息 ID 区分追加与历史插入          |
| PromptInput     | Enter 发送、Shift+Enter 换行、中文输入法保护、草稿与提交反馈；onSubmit 和 onStop 连接业务 |
| SourceList      | 展示真实来源标题、地址与片段                                                              |
| TaskStatus      | 展示任务状态和可公开步骤摘要                                                              |
| ToolResult      | 展示工具状态、输入输出摘要与错误                                                          |
| ArtifactPreview | 纯文本或 Markdown、多版本查看、最新版本编辑与应用                                         |
| Confirmation    | 展示目标、摘要、影响与版本，确认后触发宿主回调                                            |

具体参数与可编译示例见[AI 组件目录](../../packages/aig-ui/src/ai/)，预览站按组件展示公开类型。

## 任务与消息

TaskStatus 支持 idle、queued、running、streaming、awaiting-confirmation、succeeded、failed、cancelled。其他组件接收各自类型声明规定的状态。

宿主为请求使用稳定标识，取消后过滤迟到片段。PromptInput 提交失败保留文本；受控模式由 value 与 onValueChange 管理草稿，提交成功后的清空策略也由宿主决定。

Conversation 距底部 32px 以内时跟随更新，用户阅读旧消息时保留滚动位置。历史消息插入使用稳定的 firstMessageId，追加使用 lastMessageId；消息本身也保持稳定 key。大列表的分页和数据加载由应用管理。

## 产物与确认

ArtifactPreview 的 versions 按历史到最新排列，保存时宿主创建新 revision。历史版本供查看，编辑与应用针对当前最新版本。onSave 接收 artifactId、revision 和 content，保存失败保留草稿并提供反馈。

Confirmation 绑定 artifactId 与 revision，currentRevision 用于检查当前版本。旧版本显示重新检查提示，提交期间保护重复激活，失败后支持重试。onConfirm 接收确认时的标识与版本；服务端继续校验权限、版本和幂等性。

## 内容边界

SafeMarkdown 跳过原始 HTML，并按允许协议处理链接。http、https、mailto 与可解析的站内地址可导航；远程图片默认关闭，由支持该选项的消息展示入口显式启用。代码内容作为文本展示。

宿主负责工具结果长度、敏感值脱敏、可信来源和模型凭据。来源列表只展示已提供的依据，演示数据明确标注。运行任意生成代码与运行时生成 UI 属于独立能力，当前组件库提供展示和业务回调接口。

## 接入检查

核对流式更新、向上阅读、历史插入、输入法合成、取消与迟到消息、保存失败、revision 变化和重复确认。通过真实数据验证业务闭环；自动化组件测试与真实模型评估分别记录。机器资料与页面源码的使用方式见[构建与分发](../engineering/distribution.md)。
