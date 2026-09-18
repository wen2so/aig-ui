import { Flex, type FlexProps } from '../flex/flex.js';
export interface SpaceProps extends Omit<FlexProps, 'direction'> {
  direction?: 'horizontal' | 'vertical';
}
/** 为相邻操作提供可换行间距；纵向排列默认左对齐。 */
export function Space({
  direction = 'horizontal',
  wrap = true,
  align,
  className = '',
  ...props
}: SpaceProps) {
  return (
    <Flex
      {...props}
      className={`aig-space ${className}`}
      direction={direction === 'vertical' ? 'column' : 'row'}
      align={align ?? (direction === 'vertical' ? 'stretch' : 'center')}
      wrap={wrap}
    />
  );
}
