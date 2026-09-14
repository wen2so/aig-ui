import { AigProvider, BrandMark } from './aig-provider.js';
import { Button } from '../components/button/button.js';
import { Card } from '../components/card/card.js';
import { Text } from '../components/text/text.js';
export default { title: '主题/AigProvider', component: AigProvider };
export const preview = {
  name: 'AigProvider',
  label: '主题作用域',
  description: '一处配置品牌、字体、材质与密度，控件、加载图形与浮层共同继承。',
};
/** 外层沿用全局主题，内层作用域只覆盖自己配置的字段。 */
export function Preview() {
  return (
    <>
      <Button>沿用外层主题</Button>
      <AigProvider
        brand={{ color: '#267b86' }}
        font={{ family: ['Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'] }}
        material="solid"
        density="compact"
      >
        <Card>
          <BrandMark aria-label="应用品牌" aria-hidden={false} role="img" />
          <Text>本层的品牌色、字体与材质只作用于这段内容。</Text>
          <Button>保存草稿</Button>
        </Card>
      </AigProvider>
    </>
  );
}
