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
const examples: Example[] = [
  {
    id: 'reference',
    title: '菜单入场与选中',
    description:
      '短线先建立，宽阔块面错峰闪切后收束。点击切换选中项，只有选中项持续保留底色；右下角重置可重播入场。',
    render: () => <ButtonReference />,
    code: '<Button size="sm" aria-pressed={selected} onClick={handleSelect}>音频语言</Button>\n<Button entrance={false}>关闭入场动画</Button>',
    wide: true,
  },
  {
    id: 'semantic-colors',
    title: '语义色系',
    description:
      '危险使用鲜红，成功使用绿色，警告使用琥珀色，信息使用蓝色，中性使用灰色。全局主题统一配置，加载与选中保持动作语义。',
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
    id: 'variants',
    title: '操作层级',
    description:
      '挂载时按行从左到右错峰入场，梯形整体显现，独立三角和平行四边形随机闪切。首次悬停可重播，后续进入直接高亮。',
    render: () => (
      <div className="preview-actions">
        {variants.map((variant, i) => (
          <Button key={variant} variant={variant} trailingIcon={i === 0 ? actionArrow : undefined}>
            {labels[i]}
          </Button>
        ))}
      </div>
    ),
    code: variants.map((v, i) => `<Button variant="${v}">${labels[i]}</Button>`).join('\n'),
    wide: true,
  },
  {
    id: 'playground',
    title: '交互试验台',
    description: '切换属性，观察实时样式、点击反馈与生成用法。',
    render: () => <ButtonPlayground />,
    code: '<Button variant="primary" size="md" onClick={handleCreate}>开始创作</Button>',
    wide: true,
  },
  {
    id: 'selection',
    title: '激活与持续选择',
    description: '切换视图或收藏，观察选中轮廓、边缘定位和结果反馈。Tab、Enter 与空格均可操作。',
    render: () => <ButtonSelection />,
    code: '<Button variant="outline" aria-pressed={selected} onClick={handleSelect}>图形</Button>\n<IconButton aria-label="收藏当前视图" aria-pressed={saved} onClick={handleSave}>{bookmarkIcon}</IconButton>',
    wide: true,
  },
  {
    id: 'states',
    title: '静止、加载与禁用',
    description:
      '静止保留边界，加载使用专用图标与基线扫描，禁用保持静态。入场和首次交互播放闪切，后续进入直接高亮；选中和展开保留实底、左侧标记与底线。',
    render: () => <ButtonStates />,
    code: '<Button>静止</Button>\n<Button loading>正在处理</Button>\n<Button disabled>等待开放</Button>',
    wide: true,
  },
  {
    id: 'sizes',
    title: '尺寸与图标操作',
    description: '文字与图标按钮共用轮廓，按内容长度和操作密度调整尺寸。',
    render: () => (
      <div className="preview-actions">
        <Button size="sm">小尺寸</Button>
        <Button>中尺寸</Button>
        <Button size="lg">大尺寸</Button>
        <IconButton aria-label="添加项目">
          <Icon icon={Plus} />
        </IconButton>
        <Button variant="outline" leadingIcon={bookmarkIcon} trailingIcon={actionArrow}>
          查看团队整理的全部设计资料与审阅记录
        </Button>
      </div>
    ),
    code: '<Button size="sm">小尺寸</Button>\n<Button size="md">中尺寸</Button>\n<Button size="lg">大尺寸</Button>\n<IconButton aria-label="添加项目"><Icon icon={Plus} /></IconButton>\n<Button leadingIcon={bookmarkIcon} trailingIcon={actionArrow}>查看团队整理的全部设计资料与审阅记录</Button>',
    wide: true,
  },
  {
    id: 'custom-loading',
    wide: true,
    title: '自定义加载 SVG',
    description: '切换全局图标与单个按钮覆盖，原生禁用和加载语义保持一致。',
    render: () => (
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
    ),
    code: `import { LoaderCircle } from 'lucide-react';
const loadingIcon = <Icon icon={LoaderCircle} className="demo-loader-orbit" />;
<AigProvider brand={{ loadingIcon }}>
  <Button loading>正在保存</Button>
  <Button loading loadingIcon={<Icon icon={LoaderCircle} />}>局部覆盖</Button>
</AigProvider>
/* 宿主控制自定义 SVG 内部动效。 */
.demo-loader-orbit { transform-origin: 12px 12px; animation: orbit 7s linear infinite; }
@keyframes orbit { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .demo-loader-orbit { animation: none; } }`,
  },
];
export default examples;
