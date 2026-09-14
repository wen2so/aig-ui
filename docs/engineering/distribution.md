# 构建与分发

当前交付为本地实验性 `0.1.0-alpha.0`。包版本和出口由 `packages/aig-ui/package.json` 管理。

## 生成链

`pnpm build` 依次生成 Token、编译包内 TypeScript、展开 CSS、生成组件资料并校验示例、生成 Registry 并校验 schema。

| 人工维护源                            | 自动产物                             |
| ------------------------------------- | ------------------------------------ |
| TSX、公开类型与导出                   | JS、声明文件、`api/*.json`           |
| 组件 README 与 Story                  | `components/*.md`、`examples/*.tsx`  |
| `tokens/source.json`                  | `tokens.css`、`motion.ts`            |
| `docs/component-design.md`            | `dist/design.md`                     |
| `registry/registry.json` 与 block TSX | `r/registry.json`、`r/<name>.json`   |
| 包版本、Git 状态与源码内容            | 版本、提交、dirty 标记及相应文件散列 |

产物根目录为 `packages/aig-ui/dist/`。Registry 同时保存至 `artifacts/registry/<version>/r/`。生成器读取当前工作树，准备可追溯交付时从干净提交重新构建。

## 机器资料读取

先读取 `manifest.json`，再按选中组件的引用读取资料：

- `components/<id>.json`：用途、入口、样式依赖、源码与示例引用。
- `api/<id>.json`：当前源码提取的属性签名。
- `components/<id>.md` 与 `examples/<id>.tsx`：就近说明与参与类型检查的 Story 示例。
- `source/`：同次构建的源码快照。
- `design.md`：当前组件视觉摘要。
- `llms.txt` 与 `llms-full.txt`：资料导航与聚合说明。
- `r/`：页面组合的源码安装 JSON。

manifest 当前登记 50 个组件，AigProvider 单独位于 `configuration`，其 API 为 `api/aig-provider.json`。BrandMark 等辅助导出以根入口与类型声明为准。当前状态为 `experimental`，文档中的示例用途以真实 Props 为边界。

公开资料入口包括 `aig-ui/manifest.json`、`aig-ui/llms.txt`、`aig-ui/design.md` 与 `aig-ui/metadata/*`。代码智能体按当前版本读取引用，优先组合既有组件和页面；实际业务请求与状态继续由应用提供。

## 完整本地交付流程

在仓库根目录完成依赖安装后，按顺序运行：

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

Linux CI 使用 `playwright install --with-deps chromium`。`check:size` 从独立安装包重新构建 button、motion、ai 入口并测量 JS 与 CSS 的原始和 gzip 体积，同时检查 Button 入口的 Markdown 依赖隔离，输出 `artifacts/size-report.json`。

`pack:local` 使用已有构建生成 `artifacts/aig-ui-0.1.0-alpha.0.tgz`。`prepare:consumer` 从 Registry JSON 提取 5 个页面，校验名称、目标路径与内容散列后写入 Vite 消费目录。消费依赖使用本地 tarball，每次重打包后重新安装；版本变更时同步两个消费项目中的 tarball 路径。

## Registry 与升级

5 个页面覆盖访问状态、设置表单、资料列表、AI 助手和产物审核。页面组合以源码交付，基础组件仍从 aig-ui 导入。业务项目接入后维护页面布局、数据与回调。

当前生成器通过仓库内固定 schema 校验 JSON，独立消费通过提取 JSON 内源码验证。公开 Registry 地址与正式 CLI 安装流程仍待验收，具体条件见[项目状态](../progress.md)。

升级时分别审阅包 API、Token 和页面源码差异，保留业务项目的本地修改。记录包版本、原始 block 内容与散列便于对照；发布版本产物应保持不可变，修正通过新版本交付。
