import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Button } from './button.js';

it('移入时重新分配刻面明度并保持层次跨度，宿主取消时不分配', () => {
  const enter = vi.fn();
  const { rerender } = render(<Button onPointerEnter={enter}>保存</Button>);
  const button = screen.getByRole('button', { name: '保存' });
  const facets = [...button.querySelectorAll<SVGElement>('.aig-button-highlight polygon')];
  expect(facets).toHaveLength(8);
  expect(facets.every((facet) => facet.style.getPropertyValue('--aig-facet-depth') === '')).toBe(true);

  fireEvent.pointerOver(button);
  expect(enter).toHaveBeenCalledOnce();
  const depths = facets.map((facet) => Number(facet.style.getPropertyValue('--aig-facet-depth')));
  expect(depths.every((depth) => depth > 0.25 && depth < 0.75)).toBe(true);
  expect(new Set(depths).size).toBeGreaterThanOrEqual(3);
  expect(Math.max(...depths) - Math.min(...depths)).toBeGreaterThanOrEqual(0.22);

  rerender(<Button onPointerEnter={(event) => event.preventDefault()}>保存</Button>);
  facets.forEach((facet) => facet.style.removeProperty('--aig-facet-depth'));
  fireEvent.pointerOver(button);
  expect(facets.map((facet) => facet.style.getPropertyValue('--aig-facet-depth'))).toEqual(Array(8).fill(''));
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
