import { it, expect } from 'vitest'; import { render, screen } from '@testing-library/react'; import { IconButton } from './icon-button.js';
it('图标动作有稳定名称', () => { render(<IconButton aria-label="设置">⚙</IconButton>); expect(screen.getByRole('button', {name:'设置'})).toHaveAttribute('type','button'); });
