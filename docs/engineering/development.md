# 工程结构与开发

## 模块职责

| 目录或文件                                           | 当前职责                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------- |
| `packages/aig-ui/src/components/`                    | 40 个通用组件，按组件保存实现、样式、README、Story 与相关检查 |
| `packages/aig-ui/src/motion/`                        | LoadingMark、LoadingSequence、减少动态效果与演示时钟          |
| `packages/aig-ui/src/ai/`                            | 8 个 AI 展示与交互组件，共用安全 Markdown                     |
| `packages/aig-ui/src/theme/`                         | AigProvider、品牌图形、主题材质和共享视觉样式                 |
| `packages/aig-ui/src/tokens/source.json`             | 颜色、字体、尺寸与动效参数的人工维护源                        |
| `apps/preview/`                                      | Vite 预览、组件检索、交互示例与全局主题                       |
| `apps/docs/.storybook/`                              | Storybook 配置                                                |
| `registry/`                                          | 5 个可编辑页面组合及 Registry 源描述                          |
| `examples/vite-consumer/`、`examples/next-consumer/` | 使用 tarball 的独立消费项目，位于 workspace 范围之外          |
| `scripts/`                                           | Token、CSS、API、资料、Registry 与消费源码生成                |
| `tests/`、`.github/workflows/check.yml`              | 检查用例与本地交付 CI                                         |
| `docs/`、`reference/`                                | 当前使用与维护规范、原始视觉素材                              |

基础交互复用 Base UI，图标使用 lucide-react，Markdown 使用 react-markdown 与 remark-gfm。依赖版本由 manifest 和 lockfile 管理；应用请求、鉴权和模型接入由宿主负责。

## 源码到预览

组件 Story 的 `preview` 导出经过 `scripts/preview-catalog.mjs` 生成 `apps/preview/src/catalog.ts`。新增目录项后执行：

```sh
node scripts/preview-catalog.mjs
```

预览的 `catalog-model.tsx` 组织轻量目录和资料加载器，`examples/` 按组件保存扩展示例，`example-helpers.tsx` 复用演示逻辑。`main.tsx` 负责导航，`detail-components.tsx` 展示示例与 API，`use-entry-detail.ts` 负责缓存、失败重试与切换身份隔离。目录使用静态缩略标识；进入详情才加载对应 Story、README、源码和 API。页面组合共用页面演示模块。

`apps/preview/vite.config.ts` 与发布脚本共用 `scripts/component-api.mjs`。预览 API 按组件生成动态模块，一个生成周期复用同一 TypeScript reader，源码变化时失效。扫描入口限于组件库源码，排除 Story 与测试；依赖类型仍由 TypeScript 正常解析。

预览通过别名访问源码，因此预览正常与独立安装包可用需要分别验证。

## Token 与样式

修改 `packages/aig-ui/src/tokens/source.json` 后执行 `pnpm tokens`，生成 `tokens.css` 和 `motion.ts`。`fontFamily` 支持字体数组；CSS 循环时长与有限动画常量来自同一源。

公共样式入口为 `packages/aig-ui/src/styles.css`，动效与 AI 使用各自的 `styles.css`。构建脚本展开本地 CSS 引用形成独立分发文件。共享视觉优先修改 Token 或对应主题样式，组件局部行为留在组件目录。

## 变更流程

1. 沿公开入口、实际调用方、Story 与样式核对影响范围。
2. 在现有模块内完成变更，公共 API 同步入口导出、类型和 package exports。
3. 更新就近 README、Story 和受影响的使用指南；公共视觉摘要同步 `docs/component-design.md`。
4. 执行适用检查，涉及发布资料时构建；涉及包出口时完成独立消费。
5. 在项目状态页更新当前结论与剩余边界，按独立功能提交本次文件。

公共说明与关键业务注释采用简体中文。文档只维护当前内容，版本过程通过 Git 查询。

## 常用检查

| 命令                                    | 实际覆盖                                                    |
| --------------------------------------- | ----------------------------------------------------------- |
| `pnpm lint`                             | ESLint                                                      |
| `pnpm typecheck`                        | 生成 Token 后执行 TypeScript 检查                           |
| `pnpm test`                             | Vitest 单测                                                 |
| `pnpm check`                            | lint、typecheck、test、build                                |
| `pnpm build`                            | Token、类型与 JS、CSS、机器资料、示例类型和 Registry schema |
| `pnpm build:preview`                    | Vite 预览生产构建                                           |
| `pnpm build:docs`                       | Storybook 生产构建                                          |
| `pnpm format:check`                     | 脚本指定的源码、应用、脚本及示例路径                        |
| `pnpm test:browser`                     | 顺序执行预览、动效和独立消费检查                            |
| `pnpm test:preview`、`pnpm test:motion` | 仅启动 5173 预览服务，按目标选择场景                        |
| `pnpm test:consumer`                    | Vite、Next 独立消费及源码对照                               |
| `pnpm test:cross-browser`               | Firefox、WebKit 的交互与字体关键流程                        |
| `pnpm check:size`                       | 独立包入口和预览静态依赖体积预算                            |

根 README 与 `docs/` 未被现有 `format:check` glob 覆盖，文档改动另运行 `pnpm exec prettier --check README.md "docs/**/*.md"`。单测需要控制并发时使用 `pnpm exec vitest run --maxWorkers=2`。

预览、动效与跨浏览器配置只启动 5173 服务。独立消费检查启动 4173、5173 和 4174，因为其用例包含源码与安装包对照。Next 的 dev 脚本实际运行 `next start`，先按[构建与分发](distribution.md)准备消费环境。各配置使用独立结果目录，动效默认单 worker，避免计时与截图竞争。跨浏览器自动检查不替代真实设备与辅助技术验收。

图标统一通过 `Icon` 使用按需导入的 `lucide-react` 组件。原生复选框使用 `scripts/icons.mjs` 生成的 Check、Minus 遮罩，`pnpm tokens` 同步更新 `src/internal/icon-masks.css`，由样式总入口导入。生成器读取项目 Prettier 配置，生成后可直接通过格式检查。

jsdom 测试环境在 `tests/setup.ts` 补齐 SVG 点列表的属性读取，点坐标来自实际 `points` 属性，浏览器验收继续使用原生 SVG 接口。
