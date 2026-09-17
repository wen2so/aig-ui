import { it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RadioGroup } from './radio-group.js';
it('单选组选项保持互斥', () => {
  render(
    <RadioGroup
      label="范围"
      options={[
        { value: 'a', label: '甲' },
        { value: 'b', label: '乙' },
      ]}
    />,
  );
  fireEvent.click(screen.getByLabelText('甲'));
  fireEvent.click(screen.getByLabelText('乙'));
  expect(screen.getByLabelText('乙')).toBeChecked();
  expect(screen.getByLabelText('甲')).not.toBeChecked();
});

it.each([false, true])('表单重置后重渲染保留默认值，外部关联 %s', (external) => {
  const group = () => (
    <RadioGroup
      label="范围"
      name="scope"
      form={external ? 'owner' : undefined}
      defaultValue="a"
      options={[
        { value: 'a', label: '甲' },
        { value: 'b', label: '乙' },
      ]}
    />
  );
  const ui = () =>
    external ? (
      <>
        <form id="owner" data-testid="form" />
        {group()}
      </>
    ) : (
      <form data-testid="form">{group()}</form>
    );
  const view = render(ui());
  fireEvent.click(screen.getByLabelText('乙'));
  (screen.getByTestId('form') as HTMLFormElement).reset();
  view.rerender(ui());
  expect(screen.getByLabelText('甲')).toBeChecked();
  expect(screen.getByLabelText('乙')).not.toBeChecked();
  expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('scope')).toBe('a');
});
