# Slider

在限定范围内拖动或通过键盘调整数值。

## 基本用法

```tsx
import { Slider } from 'aig-ui';
import 'aig-ui/styles.css';

<Slider
  label="预览缩放"
  min={25}
  max={200}
  defaultValue={100}
  step={5}
  formatValue={(value) => value + '%'}
/>;
```

## 状态与边界

min、max、step 参与原生滑块的边界和步长处理。value / onValueChange 支持受控值；defaultValue 为初始值，formatValue 提供视觉输出与可访问值说明。

通过 AigProvider 统一品牌和语义色。可见名称由 label 或 aria-label 提供，业务数据和持久化由宿主处理。
