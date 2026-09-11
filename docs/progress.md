# 实施进度

代码以实验性 `0.1.0-alpha.0` 开始，按组件逐项验证和提交。原方案保留为建设基线，本文件记录实际交付状态。

## 工程基线

Windows、Node 24.9.0、pnpm 10.28.1。依赖以 pnpm-lock.yaml 为准。npm 查询 aig-ui 返回 E404，名称权限在正式发布前验证。许可证和参考素材授权由权利人确认，当前仅本地打包。

## 组件记录

| 组件 | 交付 | 验证 |
| --- | --- | --- |
| Button | 五种层级、三种尺寸、原生属性/ref、loading、Story 和说明 | 类型检查、2 项单测、包构建、Storybook 构建、tarball Vite 构建、Chromium 键盘与 axe 检查通过 |

## 发布前验收

真实 Safari/iOS、NVDA/VoiceOver、两个业务试点、真实模型流、外部 AI 任务评估与正式发布仍按 delivery-plan.md 执行。自动测试记录与人工验收分别保存。

| LoadingMark | 归一化 SVG、WAAPI 连续绘制与撤回、双环、减少动画、预览目录 | 类型和构建、Chromium 提前撤回/静态/减少动画、360px 搜索与无横向溢出检查通过 |
