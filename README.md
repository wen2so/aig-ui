# aig-ui

暖白精密线绘 React 组件库。当前为本地实验性 `0.1.0-alpha.0`，提供 61 个通用组件、2 个加载动效组件、8 个 AI 组件，以及 AigProvider 主题作用域和 5 个页面组合。

## 启动预览

环境要求：Node.js `>=24.9.0 <25`、pnpm `10.28.1`。CI 使用 Node.js 24.9.0。

```sh
pnpm install --frozen-lockfile
pnpm preview
```

打开[组件预览](http://127.0.0.1:5173/)。页面支持名称与用途搜索、交互示例、源码、API 和使用说明；顶部“全局主题”实时设置品牌、字体、材质与密度。[AigProvider](http://127.0.0.1:5173/?component=AigProvider) 和 [LoadingSequence](http://127.0.0.1:5173/?component=LoadingSequence) 可直接访问。Storybook 使用 `pnpm dev` 启动，端口为 6006。

## 接入应用

```tsx
import { AigProvider, Button } from 'aig-ui';
import 'aig-ui/styles.css';

export function App() {
  return (
    <AigProvider>
      <Button>创建项目</Button>
    </AigProvider>
  );
}
```

当前通过本地 tarball 接入，React 与 React DOM 的 peer 版本均为 `19.3.0`。动效和 AI 组件分别使用 `aig-ui/motion`、`aig-ui/ai`，并导入对应样式。[快速接入](docs/guides/getting-started.md)提供完整操作。

## 文档入口

- [文档目录](docs/README.md)：按接入、设计和维护组织。
- [工程结构与开发](docs/engineering/development.md)：目录职责、生成关系和开发检查。
- [构建与分发](docs/engineering/distribution.md)：打包、Registry 与 Vite/Next 独立消费。
- [项目状态](docs/progress.md)：现有能力、验证范围与待办。

项目使用普通 CSS 与 `--aig-*` Token；完整线绘动效默认开启，系统减少动态效果偏好提供静态等价表现。许可证当前为 `UNLICENSED`，交付范围为本地使用，公开发布条件见项目状态。
