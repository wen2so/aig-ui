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
