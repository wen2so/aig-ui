# Segmented

在少量互斥选项之间切换。

## 基本用法

```tsx
import { Segmented } from 'aig-ui';
import 'aig-ui/styles.css';

<Segmented
  label="展示方式"
  name="view"
  defaultValue="list"
  options={[
    { value: 'list', label: '列表' },
    { value: 'grid', label: '网格' },
    { value: 'map', label: '地图', disabled: true },
  ]}
/>;
```

## 状态与边界

使用原生 radio 支持互斥选择、方向键、disabled、表单 name 和重置。受控使用 value / onValueChange，非受控使用 defaultValue。

共享主题颜色、精密边界与减少动态效果约定。示例中的数据由本地提供，宿主负责真实业务数据。
