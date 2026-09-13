# Accordion

将补充信息逐项展开。Root 管理展开值，Item 提供稳定标识，Header 包含 Trigger，Panel 展示关联内容。

## 组合与受控状态

```tsx
import { useState } from 'react';
import { Accordion } from 'aig-ui';
import 'aig-ui/styles.css';

function ProjectDetails() {
  const [value, setValue] = useState<string[]>(['purpose']);
  return (
    <Accordion.Root value={value} onValueChange={setValue} multiple>
      <Accordion.Item value="purpose">
        <Accordion.Header>
          <Accordion.Trigger>项目说明</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>展示项目目标与当前进度。</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="history">
        <Accordion.Header>
          <Accordion.Trigger>历史记录</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>展示最近完成的操作。</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  );
}
```

`value` 和 `defaultValue` 使用条目标识数组。受控模式将 `value` 与 `onValueChange` 配合使用；非受控模式使用 `defaultValue`。`multiple` 默认为 false，设置为 true 后允许同时展开多项。

## 过渡与内容生命周期

展开与折叠通过基础控件测量的真实高度过渡，持续 420ms，透明度配合 300ms。快速反向操作从当前尺寸继续。内部内容区承担底部间距，面板可以完整收拢。

默认在关闭过渡结束后卸载内容。`keepMounted` 保留关闭后的节点，适用于需要保留输入状态的内容。`hiddenUntilFound` 允许浏览器页内查找展开隐藏内容。系统减少动态效果时直接切换状态。

## 键盘与样式

Tab 移动焦点，Enter 或 Space 切换展开，方向键在触发器之间移动。`orientation` 设置导航方向，`disabled` 可以作用于 Root 或单项。

Trigger 保留 `aria-expanded` 和内容关联。各部件接受 `className`、`style`、ref 和适用的原生属性。主题颜色通过 AigProvider 或语义 Token 设置。
