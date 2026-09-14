# 加载与动效

## 组件选择

| 场景                             | 组件                   |
| -------------------------------- | ---------------------- |
| 品牌标记绘制与独立图形           | LoadingMark            |
| 工作空间打开、资料处理与内容交接 | LoadingSequence        |
| 保存等短操作                     | Button 的 loading 状态 |
| 局部等待与已知进度               | Spinner、Progress      |

```tsx
import { LoadingSequence } from 'aig-ui/motion';
import 'aig-ui/styles.css';
import 'aig-ui/motion/styles.css';

export function Workspace({ taskId, status }: { taskId: string; status: 'loading' | 'ready' | 'error' }) {
  return (
    <LoadingSequence
      taskId={taskId}
      status={status}
      label="正在准备工作空间"
      minimumVisibleMs={1600}
      errorContent={<p>准备未完成，请重新打开工作空间。</p>}
    >
      <main>工作空间内容</main>
    </LoadingSequence>
  );
}
```

status 由真实任务推进。新任务与重试使用新的 taskId，组件据此清理旧序列并隔离回调。完整示例见[动效源码目录](../../packages/aig-ui/src/motion/)。

## LoadingSequence

| 属性                            | 行为                                                             |
| ------------------------------- | ---------------------------------------------------------------- |
| taskId、status、label、children | 必填任务标识、状态、说明与目标内容                               |
| minimumVisibleMs                | 默认 0；品牌启动可设 1600，有限正值作为最短显示时长              |
| presentation                    | 默认 inline，只隔离当前内容；fullscreen 通过 Dialog 管理页面焦点 |
| progress                        | 0–100 的有限数值；省略或非法时采用未定进度                       |
| actions、errorContent           | 宿主取消入口与失败恢复内容                                       |
| motion                          | 默认 system；reduced 主动选择减少动态效果                        |
| onExited                        | 本次内容入场完成后调用一次；初始 ready 直接展示内容              |

取消操作、请求终止和迟到数据过滤由宿主完成。动画结束表示视觉交接完成，业务完成以任务状态为准。

## 当前时间线

图形由三角描边、错峰横线和反向双环组成。完整绘制后等待真实任务；提前 ready 时从实际描边位置开始撤回。

| 阶段           | 当前默认值                          |
| -------------- | ----------------------------------- |
| 三角绘制       | 延迟 150ms，持续 1150ms             |
| 横线绘制       | 延迟 950ms，持续 650ms              |
| 标题与进度进入 | 分别延迟 550ms、750ms，持续 850ms   |
| 外环与内环     | 14s、7s，方向相反                   |
| 标签退出       | 180ms                               |
| 横线与三角撤回 | 完整路径分别为 720ms、980ms         |
| 表面解构       | 最晚在退出后 720ms 开始，持续 800ms |
| 内容进入       | 描边撤回后开始，持续 1150ms         |

完整退出约 2130ms，提前就绪按实际绘制比例缩短。内容可交互性在描边撤回与表面解构均完成后恢复，onExited 继续等待内容入场完成。

## LoadingMark

phase 支持 drawing、holding、erasing、static，默认为 drawing。默认尺寸为 `clamp(88px, 13vh, 118px)`，size 可覆盖。label 为独立图形提供可访问名称，省略时作为装饰隐藏。onErased 在本次擦除完成后调用。

品牌图形从最近 AigProvider 读取。自定义 SVG 的坐标、颜色和稳定引用要求见[主题与品牌](theme.md)。

## 维护与验收

Token 真源为 `packages/aig-ui/src/tokens/source.json`。有限描边与交接使用 WAAPI，循环旋转使用 CSS；CSS 变量覆盖循环周期，有限编排时长通过 Token 生成的常量更新。

默认保留完整效果。系统减少动态效果偏好与主动 reduced 提供静态等价状态；预览的环境暂停只管理装饰，任务演示另有控制。按钮交互规范见[视觉语言](../design/visual-language.md)。

检查早到 ready、错误、重复信号、新任务替换、卸载、双实例、焦点、减少动态效果和 onExited 次数。静态截图用于核对构图，实际播放用于核对撤回、解构与内容交接。浏览器环境准备见[工程开发](../engineering/development.md)，当前验收边界见[项目状态](../progress.md)。
