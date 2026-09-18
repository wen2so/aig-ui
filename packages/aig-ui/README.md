# aig-ui

暖白精密线绘 React 组件库，当前为本地实验性 `0.1.0-alpha.0`。提供 61 个通用组件、2 个加载动效组件、8 个 AI 组件、AigProvider 主题作用域与 5 个 Registry 页面组合。

## 接入

当前使用本地 tarball 分发，React 与 React DOM 的 peer 版本均为 19.3.0。

```tsx
import { AigProvider, Button } from 'aig-ui';
import 'aig-ui/styles.css';

export function App() {
  return (
    <AigProvider font={{ family: ['Microsoft YaHei', 'sans-serif'] }}>
      <Button>创建项目</Button>
    </AigProvider>
  );
}
```

动效组件从 `aig-ui/motion` 导入，并增加 `aig-ui/motion/styles.css`。AI 组件从 `aig-ui/ai` 导入，并增加 `aig-ui/ai/styles.css`。基础组件也支持 `aig-ui/button` 等独立入口。

## 主题与资料

AigProvider 支持品牌 SVG、颜色、正文与标题及等宽字体、材质、密度和浮层归属。默认材质为 glass，密度为 comfortable；嵌套品牌字段与字体 Token 按作用域继承。系统减少动态效果偏好提供静态等价表现。

组件说明位于包内 `src/components/`、`src/ai/`、`src/motion/` 与 `src/theme/`。构建资料位于 `dist/`，通过 `manifest.json` 查询同版本 API、说明和可编译示例；AigProvider 单独登记在 configuration。视觉摘要通过 `aig-ui/design.md` 导出。

当前许可证为 `UNLICENSED`，适用范围为本地实验性接入。真实设备与辅助技术、业务与模型接入、公开安装需完成各自验收。应用负责真实请求、权限与数据版本。
