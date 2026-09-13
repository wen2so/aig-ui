import type { ReactNode } from 'react';
import { BrandMark, Button, CopyButton, Drawer } from 'aig-ui';

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
/** 可复制的品牌接入代码与当前预览参数一致。 */
function brandSource(color: string, shape: string, material: string, density: string) {
  return `import { AigProvider, BrandMark, Button } from 'aig-ui';
import { LoadingMark } from 'aig-ui/motion';
import 'aig-ui/styles.css';
import 'aig-ui/motion/styles.css';

<AigProvider material="${material}" density="${density}" brand={{ color: '${color}', mark: ${shapeSource[shape]} }}>
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
  children,
  onColorChange,
  onShapeChange,
  onMaterialChange,
  onDensityChange,
  onAmbientChange,
}: {
  color: string;
  shape: string;
  material: 'glass' | 'solid';
  density: 'comfortable' | 'compact';
  ambient: boolean;
  children: ReactNode;
  onColorChange: (color: string) => void;
  onShapeChange: (shape: string) => void;
  onMaterialChange: (material: 'glass' | 'solid') => void;
  onDensityChange: (density: 'comfortable' | 'compact') => void;
  onAmbientChange: (ambient: boolean) => void;
}) {
  const source = brandSource(color, shape, material, density);
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
        <Drawer.Description>在此统一调整品牌与展示偏好，切换页面后继续沿用。</Drawer.Description>
        <div className="brand-settings-sample" aria-hidden="true">
          <BrandMark />
          <div>
            <strong>线条，自有节奏。</strong>
            <span>组件、加载图形与浮层同步更新</span>
          </div>
        </div>
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
          <summary>在应用中使用当前品牌</summary>
          <p>品牌图形使用 200 × 200 坐标和 currentColor。将此配置放在应用入口。</p>
          <pre className="example-code">
            <code>{source}</code>
          </pre>
          <CopyButton value={source} label="复制品牌配置" variant="outline" size="sm" />
        </details>
        <details className="brand-source brand-api">
          <summary>主题 API</summary>
          {children}
        </details>
        <Drawer.Actions>
          <Button
            variant="ghost"
            onClick={() => {
              onColorChange('#b98b90');
              onShapeChange('triangle');
              onMaterialChange('glass');
              onDensityChange('comfortable');
              onAmbientChange(true);
            }}
          >
            恢复默认
          </Button>
          <Drawer.Close render={<Button />}>完成设置</Drawer.Close>
        </Drawer.Actions>
      </Drawer.Content>
    </Drawer.Root>
  );
}
