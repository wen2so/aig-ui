# aig-ui

暖白 React 组件库，当前交付为本地实验性 `0.1.0-alpha.0`。包含 50 个组件、5 个页面组合、独立样式入口和与源码对应的机器资料。

## 启动预览

使用 Node 24.9.0 和 pnpm 10.28.1。

```sh
pnpm install --frozen-lockfile
pnpm preview
```

打开 [组件预览](http://127.0.0.1:5173/) 或 [加载动画](http://127.0.0.1:5173/?component=LoadingSequence)。页面支持名称检索，修改源码后自动更新。`pnpm dev` 在 6006 端口启动 Storybook。

加载动画保留镂空三角、错峰横线、双环旋转、反向擦除和柔和解构。完整效果保持开启；系统减少动态效果偏好作为无障碍设置生效。

## 使用方式

```tsx
import { Button, AigProvider } from 'aig-ui';
import { LoadingSequence } from 'aig-ui/motion';
import { Message } from 'aig-ui/ai';
import 'aig-ui/styles.css';
import 'aig-ui/motion/styles.css';
import 'aig-ui/ai/styles.css';
```

基础组件支持独立入口，例如 `aig-ui/button`。主题通过 `AigProvider` 和 `--aig-*` 变量覆盖，浮层挂载在最近的主题内。React 与 React DOM 当前验证版本为 19.3.0。

## 验证与本地分发

```sh
pnpm check
pnpm format:check
pnpm build:docs
pnpm build:preview
pnpm pack:local
pnpm prepare:consumer
pnpm --dir examples/vite-consumer install --ignore-workspace --no-frozen-lockfile
pnpm --dir examples/next-consumer install --ignore-workspace --no-frozen-lockfile
pnpm --dir examples/vite-consumer build
pnpm --dir examples/next-consumer build
pnpm exec playwright install chromium
pnpm test:browser
pnpm check:size
```

`pnpm check` 执行 ESLint、TypeScript、交互单测、包构建、资料示例类型检查与 Registry schema 校验。独立项目安装 `artifacts/aig-ui-0.1.0-alpha.0.tgz`，用于发现 workspace 链接掩盖的缺失文件和出口问题。消费项目的 lockfile 是本地打包验证产物；tarball 随提交与源码散列变化，安装时重新解析该本地文件。

构建输出位于 `packages/aig-ui/dist`：`manifest.json`、`api/`、`components/`、`examples/`、`source/`、`llms.txt` 与 `r/`。Registry 的版本目录另存于 `artifacts/registry/<version>/r/`。JSON 提取的 5 个页面源码在独立 Vite 项目参与类型、构建和浏览器验证。

## 文档与状态

- [实施进度与验证边界](docs/progress.md)
- [方案目录](docs/README.md)
- [组件使用说明](packages/aig-ui/src/components/)
- [AI 组件使用说明](packages/aig-ui/src/ai/)
- [动效使用说明](packages/aig-ui/src/motion/README.md)

正式发布前继续完成素材与源码授权、人工辅助技术验收、真实业务试点和公开安装验证。当前包标记为 `UNLICENSED`，本次交付保持本地使用。
