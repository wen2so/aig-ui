import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Button } from './button.js';

it('每次移入随机选取部分切片单次闪切，并保留宿主取消行为', () => {
  const enter = vi.fn();
  const animations = Array.from({ length: 4 }, () => ({
    currentTime: 480,
    play: vi.fn(),
    finish: vi.fn(),
    effect: { setKeyframes: vi.fn(), updateTiming: vi.fn() },
  }));
  const { rerender } = render(<Button onPointerEnter={enter}>保存</Button>);
  const button = screen.getByRole('button', { name: '保存' });
  Object.defineProperty(button.querySelector('.aig-button-enter'), 'getAnimations', {
    value: () => [...animations],
  });
  const random = vi.spyOn(Math, 'random').mockReturnValue(0);
  fireEvent.pointerOver(button);
  random.mockRestore();
  expect(enter).toHaveBeenCalledOnce();
  expect(animations.map((animation) => animation.play.mock.calls.length)).toEqual([1, 0, 0, 0]);
  expect(animations[0]!.currentTime).toBe(0);
  const nextRandom = vi.spyOn(Math, 'random').mockReturnValue(0.999);
  fireEvent.pointerOver(button);
  nextRandom.mockRestore();
  expect(animations.map((animation) => animation.play.mock.calls.length)).toEqual([1, 0, 1, 1]);
  const timing = animations[3]!.effect.updateTiming.mock.calls[0]![0];
  expect(timing.delay).toBeGreaterThanOrEqual(0);
  expect(timing.delay + timing.duration).toBeLessThanOrEqual(480);
  const frames = animations[3]!.effect.setKeyframes.mock.lastCall![0];
  expect(frames.map((frame: Keyframe) => frame.opacity)).toEqual([0, 1, 0, 0]);
  expect(frames.every((frame: Keyframe) => frame.easing === 'steps(1, end)')).toBe(true);
  expect(animations[0]!.effect.setKeyframes.mock.lastCall![0]).toEqual([{ opacity: 0 }, { opacity: 0 }]);

  rerender(<Button onPointerEnter={(event) => event.preventDefault()}>保存</Button>);
  fireEvent.pointerOver(button);
  expect(animations.map((animation) => animation.play.mock.calls.length)).toEqual([1, 0, 1, 1]);
});

it('默认使用普通按钮，加载时保留名称并阻止重复动作', () => {
  const click = vi.fn();
  const ref = createRef<HTMLButtonElement>();
  const { rerender } = render(
    <Button ref={ref} onClick={click}>
      保存
    </Button>,
  );
  expect(ref.current).toHaveAttribute('type', 'button');
  fireEvent.click(screen.getByRole('button', { name: '保存' }));
  rerender(
    <Button loading onClick={click}>
      保存
    </Button>,
  );
  fireEvent.click(screen.getByRole('button', { name: '保存' }));
  expect(click).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
});

it('前后图标保持装饰语义，加载保留内容槽位与切换状态', () => {
  const content = (
    <Button
      loading
      aria-pressed="true"
      leadingIcon={
        <svg>
          <title>保存图形</title>
        </svg>
      }
      trailingIcon={
        <svg>
          <title>前往</title>
        </svg>
      }
    >
      保存当前工作区
    </Button>
  );
  render(content);
  const button = screen.getByRole('button', { name: '保存当前工作区' });
  expect(button).toHaveAttribute('aria-pressed', 'true');
  expect(button).toBeDisabled();
  expect(button.querySelectorAll('.aig-button-icon[aria-hidden="true"]')).toHaveLength(2);
  expect(button.querySelector('.aig-button-label')).toHaveTextContent('保存当前工作区');
});
