# 组件分类与选用

更新日期：2026-09-18。预览目录和 Storybook 按控件用途分类，通用部分参考 [Ant Design 组件总览](https://ant.design/components/overview-cn/)。本页区分现有组件、相近能力和待评估能力；名称相近不代表 API 兼容。

## 当前控件列表

| 分类     | 组件                                                                                                  | 使用范围                                 |
| -------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 通用     | Button、IconButton、CopyButton、Icon、Text、Heading、Link                                             | 操作、图标、排版与链接                   |
| 布局     | Panel、Separator、PageHeader                                                                          | 内容分区、分隔与页面标题区               |
| 导航     | Navigation、Breadcrumb、DropdownMenu、Pagination、Tabs                                                | 页面导航、操作菜单、分页与内容切换       |
| 数据录入 | Field、Input、Textarea、Checkbox、RadioGroup、Switch、Select、Combobox                                | 字段说明、输入与选择                     |
| 数据展示 | Table、Card、DescriptionList、Badge、StatusIndicator、Accordion、EmptyState、Popover、Tooltip         | 数据、内容容器、标签、状态与补充信息     |
| 反馈     | Alert、Dialog、Drawer、Toast、Progress、Spinner、Skeleton、Result                                     | 操作提示、模态内容、等待与结果           |
| 动效     | LoadingMark、LoadingSequence                                                                          | 品牌加载与内容交接                       |
| AI       | PromptInput、Message、Conversation、SourceList、TaskStatus、ToolResult、ArtifactPreview、Confirmation | 对话、任务、来源、产物与执行确认         |
| 主题     | AigProvider                                                                                           | 品牌、颜色、字体、材质、密度与浮层作用域 |

通用部分共 40 个组件，动效 2 个、AI 8 个，AigProvider 单列配置。页面组合另列视觉样板、访问状态、设置表单、资料列表、AI 助手和产物审核，不计入组件数量。视觉样板属于预览应用，其余 5 项通过 Registry 提供。

Card 用于展示一组内容，归入数据展示；Panel 用于组织 Header、Body、Footer，归入布局。EmptyState 表示数据为空，归入数据展示；Result 表达一次操作或访问的结果，归入反馈。StatusIndicator 展示业务状态，TaskStatus 专门展示 AI 任务状态。

## 常见名称对照

| Ant Design 名称               | 本库入口                               | 能力边界                                                           |
| ----------------------------- | -------------------------------------- | ------------------------------------------------------------------ |
| Typography                    | Text、Heading、Link                    | 排版拆为独立组件                                                   |
| Divider                       | Separator                              | 水平或垂直分隔                                                     |
| Menu、Dropdown                | Navigation、DropdownMenu               | 导航链接与操作菜单分开使用；Navigation 不提供完整树形菜单能力      |
| Input.TextArea、Radio         | Textarea、RadioGroup                   | 多行输入与单选组                                                   |
| Select 的搜索能力             | Combobox                               | 可检索单选；不等同于自由输入的 AutoComplete                        |
| Tag                           | Badge                                  | 当前 Badge 表达文字标签；没有 Badge 徽标数的计数能力               |
| Descriptions、Collapse、Empty | DescriptionList、Accordion、EmptyState | 描述列表、折叠内容与空状态                                         |
| Modal、Spin                   | Dialog、Spinner                        | 模态对话框与局部等待                                               |
| Message、Notification         | Toast                                  | 提供全局提示能力；本库 AI Message 用于对话消息                     |
| ConfigProvider                | AigProvider                            | 当前提供主题作用域；不代表已具备国际化等完整全局配置能力           |
| Form                          | Field 与原生 form 组合                 | Field 负责标签、说明与错误关联，没有表单级字段注册、联动和校验引擎 |

预览搜索支持常见别名，如 Typography、Divider、Tag、Collapse、Modal、Spin。详情页与导入代码始终使用本库实际公开名称。

## 尚未提供的常用能力

以下仅用于需求盘点，不加入预览控件数量，也不表示已排期。

| 方向     | 需要时评估的控件                                                          | 先明确的使用场景                                         |
| -------- | ------------------------------------------------------------------------- | -------------------------------------------------------- |
| 布局     | Flex、Space、Grid、Layout、Splitter                                       | 重复布局组合、多栏工作台与可调整分区                     |
| 导航     | Steps、Anchor                                                             | 多步骤操作与长文档定位                                   |
| 数据录入 | InputNumber、DatePicker、TimePicker、Upload、Slider、TreeSelect、Cascader | 数值约束、时间范围、文件流程与层级选择                   |
| 数据展示 | Avatar、Tree、Statistic、Timeline、Image、Segmented                       | 人员、层级数据、指标、事件和视图切换                     |
| 反馈     | Popconfirm                                                                | 简短操作确认；复杂执行审核继续使用现有 Confirmation 组合 |

## 示例组织

参考 [Ant Design Button](https://ant.design/components/button-cn/) 按用途拆分示例。一个示例解释一个主要维度，避免把外观、颜色、业务状态和动效阶段并列为同一种“状态”。基础用法排在前面，组合调试和品牌动效放在后面。组件页提供实际支持的属性，不为对齐其他组件库而加入无实现的选项。

分类顺序和组件顺序由 `apps/preview/src/catalog-model.tsx` 维护；源码旁 Story 的分类与本表同步。新增控件时检查唯一归属、搜索、直达地址、相邻组件导航和公开导出。
