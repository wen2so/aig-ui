import type { ReactNode } from 'react';
import tokens from '../../../packages/aig-ui/src/tokens/source.json' with { type: 'json' };
import { BrandMark, Button, CopyButton, Drawer, type AigPalette, type AigFont } from 'aig-ui';

/** 色表默认值从 Token 真源读取，恢复主题时复用。 */
export const paletteLabels = {
  danger: '危险',
  success: '成功',
  warning: '警告',
  info: '信息',
  neutral: '中性',
} as const;
export const defaultPalette = Object.fromEntries(
  Object.keys(paletteLabels).map((key) => {
    const token = tokens.color[key as keyof typeof paletteLabels];
    return [
      key,
      '#' +
        token.$value.components
          .map((value) =>
            Math.round(value * 255)
              .toString(16)
              .padStart(2, '0'),
          )
          .join(''),
    ];
  }),
) as Required<AigPalette>;
/** 预览切换复用同一组节点，避免普通页面更新重启品牌绘制。 */
export const brandShapes: Record<string, ReactNode> = {
  triangle: undefined,
  diamond: (
    <>
      <path d="M100 38 162 100 100 162 38 100Z" />
      <path d="M70 100h60 M100 70v60" />
    </>
  ),
  orbit: (
    <>
      <circle cx="100" cy="100" r="46" />
      <path d="M62 138 138 62 M58 100h84" />
    </>
  ),
};
const shapeSource: Record<string, string> = {
  triangle: '<><path d="M100 38 L164 148 L36 148 Z" /><path d="M60 112h80" /></>',
  diamond: '<><path d="M100 38 162 100 100 162 38 100Z" /><path d="M70 100h60 M100 70v60" /></>',
  orbit: '<><circle cx="100" cy="100" r="46" /><path d="M62 138 138 62 M58 100h84" /></>',
};
/** 字体预设按优先级排列；自定义项由宿主直接书写字体栈。 */
export const familyPresets: Record<string, string[]> = {
  reference: ['Inter', 'Microsoft YaHei', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
  system: ['system-ui', 'Microsoft YaHei', 'sans-serif'],
  humanist: ['Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
  serif: ['Songti SC', 'SimSun', 'Georgia', 'serif'],
};
export const displayPresets: Record<string, string | string[]> = {
  serif: ['STSong', 'Songti SC', 'SimSun', 'Georgia', 'serif'],
  sans: ['Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
  inherit: 'var(--aig-font-family)',
};
export const monoPresets: Record<string, string[]> = {
  reference: ['JetBrains Mono', 'ui-monospace', 'Consolas', 'monospace'],
  system: ['ui-monospace', 'Consolas', 'monospace'],
  terminal: ['Cascadia Code', 'JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
};
/** 全局主题的字体选择；custom 使用输入框中的字体栈。 */
export interface FontChoice {
  family: string;
  custom: string;
  display: string;
  mono: string;
}
export const defaultFontChoice: FontChoice = {
  family: 'reference',
  custom: '',
  display: 'inherit',
  mono: 'reference',
};
/** 选择结果转成 Provider 属性；自定义字体栈为空时回退到系统无衬线。 */
export function resolveFont(choice: FontChoice): AigFont {
  return {
    family:
      choice.family === 'custom'
        ? choice.custom.trim() || familyPresets.system!
        : familyPresets[choice.family]!,
    display: displayPresets[choice.display]!,
    mono: monoPresets[choice.mono]!,
  };
}
/** 字体栈写成可复制的源码字面量：字体列表转成数组，CSS 函数原样保留。 */
const literal = (value: string | string[]) => {
  if (Array.isArray(value)) return `[${value.map((family) => `'${family}'`).join(', ')}]`;
  const families = value.split(',').map((family) => family.trim().replace(/^['"]|['"]$/g, ''));
  return families.every((family) => family && !family.includes('('))
    ? `[${families.map((family) => `'${family}'`).join(', ')}]`
    : `'${value}'`;
};
/** 可复制的品牌接入代码与当前预览参数一致。 */
function brandSource(
  color: string,
  shape: string,
  material: string,
  density: string,
  font: AigFont,
  palette: Required<AigPalette>,
) {
  return `import { AigProvider, BrandMark, Button } from 'aig-ui';
import { LoadingMark } from 'aig-ui/motion';
import 'aig-ui/styles.css';
import 'aig-ui/motion/styles.css';

<AigProvider
  material="${material}"
  density="${density}"
  brand={{ color: '${color}', mark: ${shapeSource[shape]} }}
  palette={${JSON.stringify(palette)}}
  font={{
    family: ${literal(font.family ?? '')},
    display: ${literal(font.display ?? '')},
    mono: ${literal(font.mono ?? '')},
  }}
>
  <BrandMark aria-label="应用品牌" aria-hidden={false} role="img" />
  <LoadingMark phase="holding" />
  <Button loading>正在保存</Button>
</AigProvider>`;
}
/** 全站品牌设置同时作用于组件预览与主题浮层。 */
export function BrandControls({
  color,
  shape,
  material,
  density,
  ambient,
  font,
  palette,
  onPaletteChange,
  onColorChange,
  onShapeChange,
  onMaterialChange,
  onDensityChange,
  onAmbientChange,
  onFontChange,
  onReset,
}: {
  palette: Required<AigPalette>;
  onPaletteChange: (palette: Required<AigPalette>) => void;
  color: string;
  shape: string;
  material: 'glass' | 'solid';
  density: 'comfortable' | 'compact';
  ambient: boolean;
  font: FontChoice;
  onColorChange: (color: string) => void;
  onShapeChange: (shape: string) => void;
  onMaterialChange: (material: 'glass' | 'solid') => void;
  onDensityChange: (density: 'comfortable' | 'compact') => void;
  onAmbientChange: (ambient: boolean) => void;
  onFontChange: (font: FontChoice) => void;
  onReset: () => void;
}) {
  const resolved = resolveFont(font);
  const source = brandSource(color, shape, material, density, resolved, palette);
  return (
    <Drawer.Root>
      <Drawer.Trigger render={<Button className="theme-toggle" variant="outline" size="sm" />}>
        <span className="theme-swatch" aria-hidden="true" />
        全局主题
      </Drawer.Trigger>
      <Drawer.Content className="brand-settings">
        <div className="brand-settings-heading">
          <div>
            <span className="preview-eyebrow">GLOBAL THEME</span>
            <Drawer.Title>全局主题</Drawer.Title>
          </div>
          <Drawer.Close render={<Button variant="ghost" size="sm" />} aria-label="关闭全局主题">
            关闭
          </Drawer.Close>
        </div>
        <Drawer.Description>
          在此统一调整品牌、字体与展示偏好，切换页面后继续沿用。属性说明见 AigProvider 组件文档。
        </Drawer.Description>
        <div className="brand-settings-sample" aria-hidden="true">
          <BrandMark />
          <div>
            <strong>线条，自有节奏。</strong>
            <span>组件、加载图形与浮层同步更新</span>
          </div>
        </div>
        <section aria-label="语义色系" className="semantic-palette">
          <h3>语义色系</h3>
          <p>品牌色用于主操作，语义色用于表达动作含义，组件与浮层同步更新。</p>
          <table>
            <thead>
              <tr>
                <th>语义</th>
                <th>颜色</th>
                <th>按钮预览</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(paletteLabels) as (keyof AigPalette)[]).map((key) => (
                <tr key={key}>
                  <th scope="row">{paletteLabels[key]}</th>
                  <td>
                    <label>
                      <input
                        type="color"
                        aria-label={`${paletteLabels[key]}色`}
                        value={palette[key]}
                        onChange={(event) => onPaletteChange({ ...palette, [key]: event.target.value })}
                      />
                      <code>{palette[key].toUpperCase()}</code>
                    </label>
                  </td>
                  <td>
                    <Button tone={key} size="sm">
                      {paletteLabels[key]}操作
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className="brand-controls">
          <label>
            <span>
              品牌色<small>{color.toUpperCase()}</small>
            </span>
            <input
              type="color"
              aria-label="品牌色"
              value={color}
              onChange={(event) => onColorChange(event.target.value)}
            />
          </label>
          <label>
            <span>
              品牌 SVG<small>全站共用的线绘图形</small>
            </span>
            <select
              aria-label="品牌 SVG"
              value={shape}
              onChange={(event) => onShapeChange(event.target.value)}
            >
              <option value="triangle">三角线绘</option>
              <option value="diamond">菱形坐标</option>
              <option value="orbit">环形轨迹</option>
            </select>
          </label>
          <label>
            <span>
              正文字体<small>正文、控件与浮层</small>
            </span>
            <select
              aria-label="正文字体"
              value={font.family}
              onChange={(event) => onFontChange({ ...font, family: event.target.value })}
            >
              <option value="reference">Inter · 微软雅黑</option>
              <option value="system">系统无衬线</option>
              <option value="humanist">人文无衬线</option>
              <option value="serif">衬线阅读</option>
              <option value="custom">自定义字体…</option>
            </select>
          </label>
          {font.family === 'custom' && (
            <label>
              <span>
                自定义字体栈<small>按 CSS 顺序书写，仅在本机已安装时生效</small>
              </span>
              <input
                type="text"
                aria-label="自定义字体栈"
                placeholder="'HarmonyOS Sans SC', sans-serif"
                value={font.custom}
                onChange={(event) => onFontChange({ ...font, custom: event.target.value })}
              />
            </label>
          )}
          <label>
            <span>
              标题字体<small>标题与展示文字</small>
            </span>
            <select
              aria-label="标题字体"
              value={font.display}
              onChange={(event) => onFontChange({ ...font, display: event.target.value })}
            >
              <option value="serif">宋体展示</option>
              <option value="sans">无衬线标题</option>
              <option value="inherit">同正文</option>
            </select>
          </label>
          <label>
            <span>
              等宽字体<small>代码、路径与编号</small>
            </span>
            <select
              aria-label="等宽字体"
              value={font.mono}
              onChange={(event) => onFontChange({ ...font, mono: event.target.value })}
            >
              <option value="reference">JetBrains Mono</option>
              <option value="system">系统等宽</option>
              <option value="terminal">终端等宽</option>
            </select>
          </label>
          <label>
            <span>
              表面材质<small>卡片、面板与浮层</small>
            </span>
            <select
              aria-label="预览材质"
              value={material}
              onChange={(event) => onMaterialChange(event.target.value as typeof material)}
            >
              <option value="glass">柔和玻璃</option>
              <option value="solid">实色表面</option>
            </select>
          </label>
          <label>
            <span>
              布局密度<small>控件尺寸与内容间距</small>
            </span>
            <select
              aria-label="预览密度"
              value={density}
              onChange={(event) => onDensityChange(event.target.value as typeof density)}
            >
              <option value="comfortable">舒适</option>
              <option value="compact">紧凑</option>
            </select>
          </label>
          <div className="brand-motion-control">
            <span>
              环境动效<small>任务与加载继续跟随实际状态</small>
            </span>
            <Button
              variant="outline"
              size="sm"
              aria-pressed={!ambient}
              onClick={() => onAmbientChange(!ambient)}
            >
              {ambient ? '暂停环境动效' : '继续环境动效'}
            </Button>
          </div>
        </div>
        <details className="brand-source">
          <summary>在应用中使用当前品牌与字体</summary>
          <p>品牌图形使用 200 × 200 坐标和 currentColor。将此配置放在应用入口。</p>
          <pre className="example-code">
            <code>{source}</code>
          </pre>
          <CopyButton value={source} label="复制主题配置" variant="outline" size="sm" />
        </details>
        <Drawer.Actions>
          <Button variant="ghost" onClick={onReset}>
            恢复默认
          </Button>
          <Drawer.Close render={<Button />}>完成设置</Drawer.Close>
        </Drawer.Actions>
      </Drawer.Content>
    </Drawer.Root>
  );
}
