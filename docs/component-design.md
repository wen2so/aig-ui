# 组件视觉用法

更新日期：2026-09-14。本文作为同版本包内 design.md 分发，描述当前实验性 Alpha 的视觉组合方式。

## 入口与主题

通用组件从 aig-ui 导入，宿主显式导入 aig-ui/styles.css。动效另导入 aig-ui/motion/styles.css，AI 组件另导入 aig-ui/ai/styles.css。

AigProvider 统一管理品牌、字体、材质、密度与 Portal 归属。brand 提供装饰色、强调色、200 × 200 坐标的 SVG 和按钮加载图标。font 的 family、display、mono 分别设置正文、展示与等宽字体，省略字段继承外层 Token。style 中的 --aig-* 变量优先于本层生成值。

默认使用暖白环境、哑光玫瑰装饰色和深玫瑰强调色；成功、警告和危险保留语义颜色。品牌色可以替换。默认正文和标题沿用 Inter 与微软雅黑，代码和编号采用 JetBrains Mono，宿主加载对应字体文件。--aig-color-signal 保留兼容，默认样式采用玫瑰装饰。

## 空间分层

| 层次 | 当前用途                                                                          |
| ---- | --------------------------------------------------------------------------------- |
| 环境 | aig-brand-scene 页面配方提供暖白渐变与稳定留白                                    |
| 容器 | Card、Panel、Dialog 默认 glass；material="solid" 提供实色阅读面；浮层跟随所属主题 |
| 控件 | 细线轮廓、基线、刻度与状态标记，文字与实际图标保持稳定                            |
| 品牌 | BrandMark 与加载图形复用主题 SVG，颜色使用 currentColor                           |

Card、Panel 和浮层以完整边界、表面和间距组织内容，卡片与面板聚焦时建立一条短线。Input、Textarea、Select 与 Combobox 保留完整边界，聚焦时延展基线。

## 按钮与状态

Button、IconButton、CopyButton 共用边框、端部刻线与基线扫描。稳定轮廓按 primary、secondary、outline、ghost、danger 区分；最小高度为 26 / 32 / 40px。

横向按钮挂载时生成 4 或 5 块固定刻面，宽主体与窄斜带交替；按行错峰入场，前段按帧硬切，后段收束。首次 hover 或键盘聚焦重播，后续直接稳定高亮；选中与展开保留实底。primary 使用外围短标，outline 保留完整框线；文字、图标和细线按可见刻面同步显示浅色。`entrance={false}` 可关闭入场。语义颜色由 AigProvider.palette 统一配置，危险默认鲜红 #E60012。逐帧依据见[Button 参考拆解](design/button-reference.md)。

按压收拢，松开回位；加载使用专用图标与基线扫描；禁用保留静态轮廓。CopyButton 的完成、失败和结果颜色对应实际复制结果。减少动态效果时直接显示稳定的交互形态。

## 动效选择

LoadingSequence 用于工作空间打开或明确任务的完整交接，包含描边建立、双环等待、反向撤回、表面解构与内容进入。taskId 隔离新任务与重试，loading / ready / error 来自实际业务。初始 ready 直接展示内容，onExited 表示内容入场完成。

普通控件保持稳定，操作触发有限过渡。短操作选择 Button loading、Spinner 或 Progress。默认保留完整动效；系统减少动态效果偏好提供静态等价状态。CSS 循环参数与有限动画常量来自同一 Token 源，CSS 覆盖用于循环样式，有限编排由生成常量控制。

## 页面与 AI 组合

五个 Registry 页面覆盖访问状态、设置表单、资料列表、AI 助手与产物审核。页面复用公共组件与样式，宿主接入真实数据与回调。

AI 阅读区保留稳定文字，步骤、来源与版本表达真实状态。Confirmation 绑定产物和 revision，业务服务验证权限、版本与幂等。Markdown 作为安全内容渲染，工具与请求由宿主执行。

## 资料与验收

manifest.json 列出组件入口、样式、API、源码和示例引用，AigProvider 位于 configuration。按同版本类型与示例接入，本文提供视觉用途摘要。

当前为本地实验性 Alpha。视觉确认、真实 Safari/iOS、人工辅助技术、真实业务与模型接入、公开安装均需各自验收。静态构图、实际播放与独立安装包消费分别提供证据。
