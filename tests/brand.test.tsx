import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { AigProvider, BrandMark, Button, IconButton } from '../packages/aig-ui/src/index.js';
import { LoadingSequence } from '../packages/aig-ui/src/motion/index.js';

afterEach(() => vi.unstubAllGlobals());

it('嵌套主题继承外层密度材质，显式局部覆盖不影响兄弟作用域', () => {
  const tree = (density: 'compact' | 'comfortable') => (
    <AigProvider theme="workspace" density={density} material="solid">
      <AigProvider data-testid="inherited" />
      <AigProvider data-testid="overridden" density="comfortable" material="glass" />
    </AigProvider>
  );
  const { rerender } = render(tree('compact'));
  expect(screen.getByTestId('inherited')).toHaveAttribute('data-aig-theme', 'workspace');
  expect(screen.getByTestId('inherited')).toHaveAttribute('data-aig-density', 'compact');
  expect(screen.getByTestId('inherited')).toHaveAttribute('data-aig-material', 'solid');
  expect(screen.getByTestId('overridden')).toHaveAttribute('data-aig-density', 'comfortable');
  expect(screen.getByTestId('overridden')).toHaveAttribute('data-aig-material', 'glass');
  rerender(tree('comfortable'));
  expect(screen.getByTestId('inherited')).toHaveAttribute('data-aig-density', 'comfortable');
});

it('品牌图形与加载图标按作用域继承，局部覆盖保留禁用语义', () => {
  const click = vi.fn();
  const { container } = render(
    <AigProvider
      brand={{
        color: '#267b86',
        loadingIcon: <svg data-testid="global-loader" />,
        mark: <path d="M20 20h160v160H20Z" />,
      }}
      style={{ '--aig-color-mark': '#123456' }}
    >
      <BrandMark />
      <AigProvider>
        <Button loading onClick={click}>
          保存
        </Button>
      </AigProvider>
      <IconButton loading aria-label="同步" loadingIcon={<svg data-testid="local-loader" />}>
        ×
      </IconButton>
    </AigProvider>,
  );
  expect(container.querySelector('.aig-brand-mark path')).toHaveAttribute('d', 'M20 20h160v160H20Z');
  expect(screen.getByTestId('global-loader')).toBeInTheDocument();
  expect(screen.getByTestId('local-loader')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '同步' })).toBeDisabled();
  expect(screen.getByRole('button', { name: '同步' })).not.toHaveTextContent('×');
  fireEvent.click(screen.getByRole('button', { name: '保存' }));
  expect(click).not.toHaveBeenCalled();
  const scopes = container.querySelectorAll<HTMLElement>('[data-aig-theme]');
  expect(scopes[0]!.style.getPropertyValue('--aig-color-mark')).toBe('#123456');
  expect(scopes[1]!.style.getPropertyValue('--aig-color-mark')).toBe('');
});

it('字体按字段覆盖，省略的字段与字符串原样保留', () => {
  const { container } = render(
    <AigProvider font={{ family: ['Noto Sans SC', 'Microsoft YaHei', 'sans-serif'], mono: 'Consolas' }}>
      <AigProvider font={{ display: ['Songti SC', 'serif'] }}>
        <Button>保存</Button>
      </AigProvider>
    </AigProvider>,
  );
  const [outer, inner] = container.querySelectorAll<HTMLElement>('[data-aig-theme]');
  expect(outer!.style.getPropertyValue('--aig-font-family')).toBe(
    "'Noto Sans SC', 'Microsoft YaHei', sans-serif",
  );
  expect(outer!.style.getPropertyValue('--aig-font-mono')).toBe('Consolas');
  expect(outer!.style.getPropertyValue('--aig-font-display')).toBe('');
  expect(inner!.style.getPropertyValue('--aig-font-display')).toBe("'Songti SC', serif");
  expect(inner!.style.getPropertyValue('--aig-font-family')).toBe('');
});

it('自定义多种 SVG 形状完成撤回后只交接一次', async () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
  const exited = vi.fn();
  const brand = {
    mark: (
      <>
        <circle cx="100" cy="100" r="40" />
        <rect x="50" y="50" width="100" height="100" />
      </>
    ),
  };
  const example = (status: 'loading' | 'ready') => (
    <AigProvider brand={brand}>
      <LoadingSequence taskId="custom" label="准备资料" status={status} motion="reduced" onExited={exited}>
        <Button>开始</Button>
      </LoadingSequence>
    </AigProvider>
  );
  const { container, rerender } = render(example('loading'));
  expect(container.querySelector('.aig-loading-mark g circle')).toHaveAttribute('pathLength', '1');
  rerender(example('ready'));
  await waitFor(() => expect(exited).toHaveBeenCalledTimes(1));
  expect(screen.getByRole('button', { name: '开始' }).closest('[inert]')).toBeNull();
  rerender(example('ready'));
  expect(exited).toHaveBeenCalledTimes(1);
});
