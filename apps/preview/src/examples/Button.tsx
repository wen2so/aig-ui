import {
  ButtonReference,
  tones,
  Button,
  variants,
  actionArrow,
  labels,
  ButtonPlayground,
  ButtonSelection,
  ButtonStates,
  IconButton,
  Icon,
  Plus,
  bookmarkIcon,
  AigProvider,
  CustomLoadingIcon,
  LoaderCircle,
  RotateCcw,
  type Example,
} from '../example-helpers.js';

/** 示例各自说明一个属性维度，基础用法先于组合调试和品牌动效。 */
const examples: Example[] = [
  {
    id: 'variants',
    title: '操作层级',
    description: 'primary 用于主要操作，secondary 用于次要操作，outline 保留完整边框，ghost 用于低强调操作。',
    render: () => (
      <div className="preview-actions">
        {variants.map((variant, i) => (
          <Button key={variant} variant={variant} trailingIcon={i === 0 ? actionArrow : undefined}>
            {labels[i]}
          </Button>
        ))}
      </div>
    ),
    code: variants.map((variant, i) => `<Button variant="${variant}">${labels[i]}</Button>`).join('\n'),
    wide: true,
  },
  {
    id: 'semantic-colors',
    title: '语义颜色',
    description:
      'tone 表达操作含义，可与外观独立组合。危险操作统一使用 tone="danger"；旧版 variant="danger" 保留兼容，固定使用危险色。',
    render: () => (
      <div className="preview-actions">
        {tones.map((tone, index) => (
          <Button key={tone} tone={tone}>
            {['常规操作', '查看进度', '确认通过', '需要留意', '删除记录'][index]}
          </Button>
        ))}
      </div>
    ),
    code: tones.map((tone) => `<Button tone="${tone}">${tone}</Button>`).join('\n'),
    wide: true,
  },
  {
    id: 'sizes',
    title: '按钮尺寸',
    description: 'sm、md、lg 分别用于紧凑、常规和较大的操作区域，默认使用 md。',
    render: () => (
      <div className="preview-actions">
        <Button size="sm">小尺寸</Button>
        <Button size="md">中尺寸</Button>
        <Button size="lg">大尺寸</Button>
      </div>
    ),
    code: '<Button size="sm">小尺寸</Button>\n<Button size="md">中尺寸</Button>\n<Button size="lg">大尺寸</Button>',
    wide: true,
  },
  {
    id: 'icons',
    title: '图标与长文本',
    description: '图标可放在文字前后，长文本自然换行。只有图标的操作使用 IconButton，并提供 aria-label。',
    render: () => (
      <div className="preview-actions">
        <Button leadingIcon={<Icon icon={Plus} />}>创建项目</Button>
        <IconButton aria-label="添加项目">
          <Icon icon={Plus} />
        </IconButton>
        <Button variant="outline" leadingIcon={bookmarkIcon} trailingIcon={actionArrow}>
          查看团队整理的全部设计资料与审阅记录
        </Button>
      </div>
    ),
    code: '<Button leadingIcon={<Icon icon={Plus} />}>创建项目</Button>\n<IconButton aria-label="添加项目"><Icon icon={Plus} /></IconButton>\n<Button variant="outline" leadingIcon={bookmarkIcon} trailingIcon={actionArrow}>查看团队整理的全部设计资料与审阅记录</Button>',
    wide: true,
  },
  {
    id: 'states',
    title: '加载与禁用',
    description:
      'loading 表示操作执行中，并阻止重复激活；disabled 表示当前不可操作。两者均保留按钮名称，悬停和聚焦由实际交互触发。',
    render: () => (
      <div className="example-stack">
        <ButtonStates />
        <details id="example-custom-loading">
          <summary>自定义加载图标</summary>
          <p>全局图标通过 AigProvider 设置，单个按钮可使用 loadingIcon 覆盖。</p>
          <AigProvider brand={{ loadingIcon: <CustomLoadingIcon /> }}>
            <div className="preview-actions">
              <Button loading>全局加载图标</Button>
              <Button loading loadingIcon={<Icon icon={LoaderCircle} className="demo-loader-orbit" />}>
                局部加载图标
              </Button>
              <IconButton loading aria-label="同步资料">
                <Icon icon={RotateCcw} />
              </IconButton>
            </div>
          </AigProvider>
        </details>
      </div>
    ),
    code: `<Button>保存设置</Button>
<Button loading>正在处理</Button>
<Button disabled>等待开放</Button>

// 自定义加载图标沿用文字颜色；宿主可为 SVG 添加动效。
<AigProvider brand={{ loadingIcon: <Icon icon={LoaderCircle} /> }}>
  <Button loading>全局加载图标</Button>
  <Button loading loadingIcon={<Icon icon={RotateCcw} />}>局部加载图标</Button>
</AigProvider>`,
    wide: true,
  },
  {
    id: 'selection',
    title: '切换按钮',
    description:
      '需要保留开关选择时，使用 aria-pressed 配合业务状态。悬停、聚焦和按压不代表已选中；页面导航使用 Navigation 或 Tabs。',
    render: () => <ButtonSelection />,
    code: '<Button variant="outline" aria-pressed={selected} onClick={handleSelect}>图形</Button>\n<IconButton aria-label="收藏当前视图" aria-pressed={saved} onClick={handleSave}>{bookmarkIcon}</IconButton>',
    wide: true,
  },
  {
    id: 'reference',
    title: '菜单入场与选中',
    description:
      '入场与悬停偶尔触发闪切，选中项保留底色。重置后仍按低频随机触发；entrance={false} 可关闭挂载入场。',
    render: () => <ButtonReference />,
    code: '<Button size="sm" aria-pressed={selected} onClick={handleSelect}>音频语言</Button>\n<Button entrance={false}>关闭入场动画</Button>',
    wide: true,
  },
  {
    id: 'playground',
    title: '交互试验台',
    description: '组合外观、颜色、尺寸与状态，检查实际点击反馈和当前属性用法。',
    render: () => <ButtonPlayground />,
    code: '<Button variant="primary" tone="brand" size="md" onClick={handleCreate}>开始创作</Button>',
    wide: true,
  },
];
export default examples;
