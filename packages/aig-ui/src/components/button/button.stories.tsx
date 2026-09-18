import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button.js';

export default { title: '通用/Button', component: Button, args: { children: '保存设置' } } satisfies Meta<
  typeof Button
>;
export const Default: StoryObj<typeof Button> = {};
export const Loading: StoryObj<typeof Button> = { args: { loading: true } };
export const Disabled: StoryObj<typeof Button> = { args: { disabled: true } };
export const Variants = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
    {(['primary', 'secondary', 'outline', 'ghost'] as const).map((variant) => (
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
  </div>
);
export const Tones = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
    {(['brand', 'neutral', 'info', 'success', 'warning', 'danger'] as const).map((tone) => (
      <Button key={tone} tone={tone}>
        {tone}
      </Button>
    ))}
  </div>
);
