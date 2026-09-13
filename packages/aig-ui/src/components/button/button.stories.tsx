import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button.js';

export default { title: '基础/Button', component: Button, args: { children: '保存设置' } } satisfies Meta<
  typeof Button
>;
export const Default: StoryObj<typeof Button> = {};
export const Loading: StoryObj<typeof Button> = { args: { loading: true } };
export const Variants = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
    {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((variant) => (
      <Button key={variant} variant={variant}>
        {variant}
      </Button>
    ))}
  </div>
);
export const Sizes = () => (
  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
    <Button size="sm">小尺寸</Button>
    <Button size="md">中尺寸</Button>
    <Button size="lg">大尺寸</Button>
    <Button disabled>暂不可用</Button>
  </div>
);
export const LoadingVariants = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
    {(['primary', 'secondary', 'outline', 'ghost', 'danger'] as const).map((variant) => (
      <Button key={variant} variant={variant} loading>
        {variant}
      </Button>
    ))}
  </div>
);
