import type{ComponentPropsWithRef}from'react';
/** 表格保持二维结构，超宽内容在独立区域滚动。 */
function Root({className='',...props}:ComponentPropsWithRef<'table'>){return <div className="aig-table-scroll" tabIndex={0} role="region" aria-label="表格内容"><table {...props} className={`aig-table ${className}`}/></div>;}
/** 表格标题用于说明数据范围。 */
function Caption(props:ComponentPropsWithRef<'caption'>){return <caption {...props}/>;}
/** 表头区域。 */
function Head(props:ComponentPropsWithRef<'thead'>){return <thead {...props}/>;}
/** 数据主体。 */
function Body(props:ComponentPropsWithRef<'tbody'>){return <tbody {...props}/>;}
/** 行使用宿主提供的稳定 key。 */
function Row(props:ComponentPropsWithRef<'tr'>){return <tr {...props}/>;}
/** 默认列标题语义，可显式设置行标题。 */
function HeaderCell({scope='col',...props}:ComponentPropsWithRef<'th'>){return <th {...props} scope={scope}/>;}
/** 保留原生单元格属性。 */
function Cell(props:ComponentPropsWithRef<'td'>){return <td {...props}/>;}
/** 使用 Table、Caption、Head、Body、Row、HeaderCell 和 Cell 组合数据。 */
export const Table=Object.assign(Root,{Caption,Head,Body,Row,HeaderCell,Cell});
