// @vitest-environment node
import { expect, it } from 'vitest';
import { resolve } from 'node:path';
import { createApiReader } from '../scripts/component-api.mjs';

it('公开 API 包含原生属性、组合部件、默认值与关联数据类型', () => {
  const read = createApiReader();
  const button = read(resolve('packages/aig-ui/src/components/button/button.tsx'), 'Button')[0]!;
  expect(button.props.find((prop) => prop.name === 'variant')?.defaultValue).toBe("'primary'");
  expect(button.props.map((prop) => prop.name)).toEqual(
    expect.arrayContaining(['loadingIcon', 'leadingIcon', 'trailingIcon', 'disabled', 'onClick', 'type']),
  );
  const accordion = read(resolve('packages/aig-ui/src/components/accordion/accordion.tsx'), 'Accordion');
  expect(accordion.find((part) => part.part === 'Root')!.props.map((prop) => prop.name)).toEqual(
    expect.arrayContaining(['value', 'multiple', 'onValueChange']),
  );
  const select = read(resolve('packages/aig-ui/src/components/select/select.tsx'), 'Select');
  expect(select.find((part) => part.part === 'SelectOption')!.props.map((prop) => prop.name)).toEqual([
    'value',
    'label',
    'disabled',
  ]);
}, 30000);
