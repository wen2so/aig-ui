# 实施进度

更新日期：2026-09-12。当前版本为本地实验性 `0.1.0-alpha.0`，已实现 50 个组件和 5 个页面组合。每个组件与页面组合均有独立提交；首个 Button 提交因当时签名服务故障使用普通提交，服务恢复后的提交均使用 GPG 签名。

## 预览入口

- [统一组件与页面预览](http://127.0.0.1:5173/)
- [镂空加载动画与原版对照](http://127.0.0.1:5173/?component=LoadingSequence)
- [Storybook](http://localhost:6006/)

预览支持名称检索和热更新。加载演示提供重播、提前就绪、失败重试、慢速和原版对照。页面中的数据和 AI 消息流均明确使用本地演示数据。

## 交付范围

| 阶段     | 已实现内容                                                                                                                                                                                                                 | 状态                                                   |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| M0       | LoadingMark、LoadingSequence                                                                                                                                                                                               | 已实现并完成 Chromium 动效检查，视觉观感继续由用户审阅 |
| G0       | Button、IconButton、Link、Text、Heading、Icon、Card、Panel、Badge、StatusIndicator、Spinner、Progress、EmptyState、Result、DescriptionList、CopyButton、Toast                                                              | 17 个组件已分别验证和提交                              |
| G1       | Field、Input、Textarea、Checkbox、RadioGroup、Switch、Select、Combobox、Dialog、Drawer、Popover、Tooltip、DropdownMenu、Tabs、Breadcrumb、Navigation、Pagination、Table、Alert、Skeleton、Separator、Accordion、PageHeader | 23 个组件已分别验证和提交                              |
| A1       | PromptInput、Message、Conversation、SourceList、TaskStatus、ToolResult、ArtifactPreview、Confirmation                                                                                                                      | 8 个组件已分别验证和提交                               |
| 页面组合 | access-state-page、settings-form、filterable-list、ai-assistant、artifact-review                                                                                                                                           | 5 个页面组合已分别验证和提交                           |
| 工程资料 | Token 生成、Storybook、实时预览、源码/API/示例索引、Registry schema 校验、Vite 与 Next 消费项目、CI 工作流                                                                                                                 | 本地交付链已接通，远端 CI 在推送后运行                 |

主题通过 AigProvider 继承变量，Dialog、Toast 和全屏加载等浮层使用最近的主题容器。SSR 首次挂载时等待容器就绪，避免 Portal 提前进入 body。普通组件和 AI 组件使用独立入口，Button 消费产物中没有 Markdown 依赖。

加载标记采用透明留白、镂空三角、错峰横线和双环旋转。提前完成时从当前描边位置连续撤回，清晰擦除后柔和解构；实际动画完成信号驱动内容交接。按用户要求保留完整效果，系统减少动态效果偏好作为无障碍设置生效。

## 验证记录

环境：Windows x64、Node 24.9.0、pnpm 10.28.1、React/React DOM 19.3.0。根工程 TypeScript 6.0.3；Vite 消费项目使用 TypeScript 7.0.2，Next 16.3.4 消费项目使用 TypeScript 6.0.3。根 lockfile 锁定工具版本。

| 检查                 | 本地结果与证据                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ESLint 与 TypeScript | 通过；包含自有 Props、组合页面和无障碍静态规则                                                                                 |
| Vitest               | 22 个文件、70 项检查通过；覆盖全部代表性预览及关键交互分支                                                                     |
| Chromium             | 18 项场景；覆盖 SVG 镂空与关键帧、提前退出/重试/取消隔离、焦点恢复、检索选择、消息滚动、5 个页面操作和消费项目交互             |
| axe                  | Button 消费页、Dialog 与代表性 AI 预览通过；这部分检查补充人工辅助技术验收                                                     |
| 视口与偏好           | 1280×720、360×800、小高度 640×360 与 CSS 200% 放大、强制颜色和减少动态效果场景通过                                             |
| 包与文档             | ESM/声明/CSS、Storybook 和统一预览生产构建通过                                                                                 |
| Vite 独立安装        | 实际 tarball 的 Button、LoadingSequence、AI 入口、主题浮层与 5 个 Registry JSON 源码通过类型和构建检查；产物编辑浏览器流程通过 |
| Next 独立安装        | 生产构建、服务端 HTML、客户端交互、Portal 与水合检查通过；包含 Tailwind 4.3.3 preflight 的宿主环境                             |
| 机器资料             | 50 个组件由真实 TypeScript 签名提取 API；源码散列、文档和类型引用存在性检查、同版本示例编译通过                                |
| Registry             | 5 个安装项通过仓库固定的官方 schema，源码与散列一致；版本目录随包构建生成                                                      |

复现命令见根目录 README。运行输出保存在本地 artifacts：check.log、browser.log、consumer-browser.log、docs-build.log、preview-build.log、next-build.log、size-report.json。该目录作为生成产物保存，CI 配置会上传检查产物。

体积测量从独立安装包构建，React 作为宿主依赖排除：Button gzip 436 B，完整 motion 入口约 25.9 KiB，AI 入口约 56.0 KiB；基础 CSS gzip 约 4.5 KiB。全量展示页面主动载入所有组件，预览构建的单 chunk 警告保留记录。实际应用按需要导入组件，完整动画保持开启。

## 资料与升级

组件就近 README、Props/JSDoc 和实际 Story 是文档真源。构建生成 manifest、按组件拆分的 API/说明、源码快照、可编译示例、llms 索引与版本化 Registry。manifest 标记 experimental，并记录 sourceCommit、sourceDirty 和 sourceSha256。

Registry 分发页面源码，基础实现仍来自同版本 aig-ui 包。升级页面时将新版本安装项提取到临时目录，与本地已修改页面进行 diff 后合并；业务回调和本地布局保留。当前独立消费检查使用 Registry JSON 的真实内容，公开 shadcn CLI 安装链在 npm 版本和公共地址发布后验证。

## 正式发布前继续完成

- 用户对镂空加载动画节奏与视觉观感的确认；真实 Safari/iOS 与 NVDA/VoiceOver 人工检查。
- 两个真实业务场景的 RC 接入，以及真实模型流、固定 AI 任务与修正次数的评估。
- 目标设备动画帧率、长消息与大列表压力记录；保持完整动画的视觉要求。
- npm 名称与发布账号、源码许可证、参考素材授权、公开文档/Registry 地址和维护责任人。

当前仅本地打包，许可证字段为 UNLICENSED。源码和消费样例可继续迭代，正式 v1.0 的外部验收项目按 delivery-plan.md 跟进。
