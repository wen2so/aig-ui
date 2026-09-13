export interface ApiSignature {
  part: string;
  kind?: 'type';
  propsType: string;
  props: { name: string; required: boolean; type: string; description: string; defaultValue: string }[];
}
/** 读取当前源码声明中的组件属性。 */
export function createApiReader(root?: string): (file: string, name: string) => ApiSignature[];
