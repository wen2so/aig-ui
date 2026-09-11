import type{ComponentPropsWithRef}from'react';
/** decorative 为 true 时仅作装饰。 */
export function Separator({orientation='horizontal',decorative=false,className='',...props}:ComponentPropsWithRef<'div'>&{orientation?:'horizontal'|'vertical';decorative?:boolean}){return <div {...props} role={decorative?'none':'separator'} aria-orientation={decorative?undefined:orientation} data-orientation={orientation} className={`aig-separator ${className}`}/>;}
