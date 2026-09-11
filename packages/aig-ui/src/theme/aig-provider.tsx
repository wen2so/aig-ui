'use client';

import { createContext, useContext, useRef, type ComponentPropsWithRef, type CSSProperties, type RefObject } from 'react';

const PortalContext = createContext<RefObject<HTMLDivElement | null> | null>(null);
/** 主题作用域仅管理材质、密度、方向和浮层归属。 */
export interface AigProviderProps extends ComponentPropsWithRef<'div'> {
  theme?: string;
  density?: 'comfortable' | 'compact';
  material?: 'solid' | 'glass';
  style?: CSSProperties & Record<`--aig-${string}`, string | number>;
}
/** 浮层挂载到当前主题内部，继承宿主覆盖的 CSS 变量。 */
export function AigProvider({theme='warm',density='comfortable',material='solid',children,...props}:AigProviderProps) {
  const container=useRef<HTMLDivElement|null>(null);
  return <div {...props} data-aig-theme={theme} data-aig-density={density} data-aig-material={material}><PortalContext.Provider value={container}>{children}<div ref={container} className="aig-portal-container" /></PortalContext.Provider></div>;
}
/** 返回最近主题的 Portal 容器；省略 Provider 时使用基础库默认容器。 */
export function useAigPortalContainer(){return useContext(PortalContext) ?? undefined;}
