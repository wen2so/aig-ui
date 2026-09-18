# 组件分类与选用

更新日期：2026-09-18。预览目录和 Storybook 按控件用途分类，通用部分参考 [Ant Design 组件总览](https://ant.design/components/overview-cn/)。本页说明现有组件、名称对照和已实现的能力边界；名称相近不代表 API 兼容。

## 当前控件列表

| 分类     | 组件                                                                                                                                               | 使用范围                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 通用     | Button、IconButton、CopyButton、Icon、Text、Heading、Link                                                                                          | 操作、图标、排版与链接                   |
| 布局     | Flex、Space、Grid、Layout、Splitter、Panel、Separator、PageHeader                                                                                  | 内容分区、分隔与页面标题区               |
| 导航     | Navigation、Breadcrumb、DropdownMenu、Pagination、Tabs、Steps、Anchor                                                                              | 页面导航、操作菜单、分页与内容切换       |
| 数据录入 | Field、Input、Textarea、InputNumber、DatePicker、TimePicker、Checkbox、RadioGroup、Switch、Select、Combobox、Slider、Upload、TreeSelect、Cascader  | 字段说明、输入与选择                     |
| 数据展示 | Table、Card、DescriptionList、Badge、StatusIndicator、Avatar、Statistic、Timeline、Image、Segmented、Tree、Accordion、EmptyState、Popover、Tooltip | 数据、内容容器、标签、状态与补充信息     |
| 反馈     | Alert、Dialog、Drawer、Popconfirm、Toast、Progress、Spinner、Skeleton、Result                                                                      | 操作提示、模态内容、等待与结果           |
| 动效     | LoadingMark、LoadingSequence                                                                                                                       | 品牌加载与内容交接                       |
| AI       | PromptInput、Message、Conversation、SourceList、TaskStatus、ToolResult、ArtifactPreview、Confirmation                                              | 对话、任务、来源、产物与执行确认         |
| 主题     | AigProvider                                                                                                                                        | 品牌、颜色、字体、材质、密度与浮层作用域 |

通用部分共 61 个组件，动效 2 个、AI 8 个，AigProvider 单列配置。页面组合另列视觉样板、访问状态、设置表单、资料列表、AI 助手和产物审核，不计入组件数量。视觉样板属于预览应用，其余 5 项通过 Registry 提供。

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

## 新增能力与边界

本轮补齐原清单的 21 项控件。全部提供公开子路径、可运行示例、源码说明和 API；以下边界按当前实现说明。

| 组件                        | 已提供                                                     | 当前边界                                                         |
| --------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| Flex、Space、Grid、Layout   | 弹性布局、间距、列网格、页面区域                           | Grid 支持固定列和最小列宽自适应；未提供 24 栅格断点对象          |
| Splitter                    | 双面板、横纵方向、指针拖动、方向键与 Home / End、受控比例  | 百分比上下限；未提供多面板嵌套管理和折叠 API                     |
| Steps、Anchor               | 步骤位置与错误状态、可选步骤跳转、文档锚点与当前章节       | 业务流程推进由宿主决定                                           |
| InputNumber、Slider         | 数值边界、步长、原生键盘和表单语义                         | 单值；没有双滑块范围选择                                         |
| DatePicker、TimePicker      | 原生单值日期与时间、min / max / step、清空和表单提交       | 弹出面板由浏览器提供；没有范围、周、季度和自定义禁用日期         |
| Upload                      | 选择与拖入、类型/大小/数量校验、进度、取消、移除、失败重试 | 宿主通过 onUpload 提供请求与 AbortSignal；不内置上传服务         |
| Tree、TreeSelect、Cascader  | 稳定 ID、层级禁用、单选、树键盘导航、路径提交与清除        | 没有多选、异步加载、拖拽和虚拟化；选择器的表单重置使用受控 value |
| Avatar、Statistic、Timeline | 图片失败回退、数字格式化、时间与事件状态                   | 指标和事件来自宿主，不提供业务计算                               |
| Image                       | 替代文字、错误回退、弹层预览与 Escape 关闭                 | 没有图库、缩放和旋转                                             |
| Segmented                   | 原生互斥选择、键盘、禁用和表单重置                         | 少量选项的视图切换；长选项集合使用 Select                        |
| Popconfirm                  | 简短确认、异步锁定、失败保留和重试                         | 复杂执行审核使用 Confirmation；在执行中保留弹层                  |

## 示例组织

参考 [Ant Design Button](https://ant.design/components/button-cn/) 按用途拆分示例。一个示例解释一个主要维度，避免把外观、颜色、业务状态和动效阶段并列为同一种“状态”。基础用法排在前面，组合调试和品牌动效放在后面。组件页提供实际支持的属性，不为对齐其他组件库而加入无实现的选项。

分类顺序和组件顺序由 `apps/preview/src/component-groups.ts` 维护；源码旁 Story 的分类与本表同步。新增控件时检查唯一归属、搜索、直达地址、相邻组件导航和公开导出。
