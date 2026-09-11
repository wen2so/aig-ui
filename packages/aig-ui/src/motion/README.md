# 加载动效

从 `aig-ui/motion` 导入组件，宿主同时导入 `aig-ui/styles.css` 和 `aig-ui/motion/styles.css`。

LoadingMark 使用参考页的三角、横线和双环。`phase` 默认为 drawing，另支持 holding、erasing、static；尺寸默认 104。`label` 提供独立图像名称，省略时作为装饰隐藏。系统减少动画优先，`motion="reduced"` 可主动使用静态标记。

描边由 WAAPI 控制，环形旋转由 CSS 控制。提前切换 erasing 时固定当前描边，再按已绘制比例撤回；卸载释放动画，onErased 在本次擦除完成后调用。时间统一由 tokens/source.json 生成。

实验性 alpha。可编译演示见 loading-mark.stories.tsx，浏览器关键帧与取消检查见 tests/browser/motion.spec.ts。

LoadingSequence 接收 taskId、loading/ready/error 和任务说明。新任务与重试使用新 taskId；minimumVisibleMs 默认 0，品牌启动显式设置 1600。inline 只隔离组件内容，fullscreen 通过 Base UI Dialog 的 Portal 隔离页面焦点。actions 提供宿主取消入口，errorContent 提供恢复操作。progress 只展示 0–100 有限数值，其余采用未定进度。

反向擦除与解构完成后恢复内容交互；内容入场完成后 onExited 恰好调用一次。初始 ready 直接显示内容。完整模糊、缩放和 SVG 编排保留，系统减少动态效果及主动 reduced 是无障碍设置，不依据设备性能自动缩减动画。
