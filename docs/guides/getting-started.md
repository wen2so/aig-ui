# 快速接入

## 本地开发与浏览

在仓库根目录使用 Node.js `>=24.9.0 <25` 与 pnpm `10.28.1`：

```sh
pnpm install --frozen-lockfile
pnpm preview
```

预览站为 [127.0.0.1:5173](http://127.0.0.1:5173/)，直接读取组件源码，适合边修改边查看。Storybook 通过 `pnpm dev` 在 6006 端口启动。详细导航见[预览指南](preview.md)。

## 安装到独立应用

先在库仓库根目录生成当前包：

```sh
pnpm build
pnpm pack:local
```

产物为 `artifacts/aig-ui-0.1.0-alpha.0.tgz`。`pack:local` 打包已有文件，源码修改后先重新构建。将 tarball 复制到宿主项目的 `vendor/`，在宿主项目执行：

```sh
pnpm add ./vendor/aig-ui-0.1.0-alpha.0.tgz react@19.3.0 react-dom@19.3.0
```

当前包要求 React 与 React DOM 均为 19.3.0。包标记为 `UNLICENSED`，当前分发范围见[项目状态](../progress.md)。

## 最小应用

```tsx
import { AigProvider, Button } from 'aig-ui';
import 'aig-ui/styles.css';

export function App() {
  return (
    <AigProvider brand={{ color: '#9d6575' }} font={{ family: ['Microsoft YaHei', 'sans-serif'] }}>
      <Button onClick={() => console.log('创建项目')}>创建项目</Button>
    </AigProvider>
  );
}
```

交互组件在 Next.js 中放入客户端组件文件，并在文件首行添加 `'use client';`。全局 CSS 在应用布局或全局样式入口导入。现成宿主结构见 [Vite 示例](../../examples/vite-consumer/)和 [Next 示例](../../examples/next-consumer/)。

## 入口与样式

| 内容                             | JavaScript 入口                                     | 样式                                  |
| -------------------------------- | --------------------------------------------------- | ------------------------------------- |
| 通用组件、AigProvider、BrandMark | `aig-ui`，通用组件也支持 `aig-ui/button` 等独立入口 | `aig-ui/styles.css`                   |
| LoadingMark、LoadingSequence     | `aig-ui/motion`                                     | 基础样式加 `aig-ui/motion/styles.css` |
| 消息、任务、产物与确认           | `aig-ui/ai` 或 `aig-ui/ai/message` 等独立入口       | 基础样式加 `aig-ui/ai/styles.css`     |
| 仅使用视觉变量                   | `aig-ui/tokens.css`                                 | 提供 Token，完整组件仍需基础样式      |

样式是显式入口，包将 CSS 标记为 side effect。Vite TypeScript 项目启用副作用导入检查时，在 `src/vite-env.d.ts` 保留 `/// <reference types="vite/client" />`。

应用根布局通常配置一次 AigProvider，嵌套作用域可覆盖品牌与字体；Portal 浮层跟随所属主题。详见[主题与品牌](theme.md)。完整业务页面可复用 5 个 Registry 页面源码，生成与消费步骤见[构建与分发](../engineering/distribution.md)。
