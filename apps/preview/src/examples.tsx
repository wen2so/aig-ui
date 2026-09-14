import { useState, type ReactNode } from 'react';
import {
  Button,
  IconButton,
  Input,
  Textarea,
  Field,
  Checkbox,
  Switch,
  RadioGroup,
  Select,
  Combobox,
  Card,
  Panel,
  Badge,
  StatusIndicator,
  Progress,
  Alert,
  Result,
  Tabs,
  AigProvider,
} from 'aig-ui';
import { TaskStatus } from 'aig-ui/ai';
import { LoadingMark } from 'aig-ui/motion';
import { Interactive as SequenceDemo } from '../../../packages/aig-ui/src/motion/loading-sequence.stories.js';

export interface Example {
  id: string;
  title: string;
  description: string;
  render: () => ReactNode;
  code: string;
  wide?: boolean;
}

const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;
const labels = ['开始创作', '保存草稿', '查看详情', '了解更多', '删除草稿'];
const actionArrow = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 12h15m-6-6 6 6-6 6" />
  </svg>
);
const bookmarkIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 4h12v16l-6-4-6 4Z" />
  </svg>
);

/** 自定义 SVG 保留清晰轮廓，运动只作用于外侧线段。 */
function CustomLoadingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle className="demo-loader-orbit" cx="12" cy="12" r="10" strokeDasharray="14 8" />
      <path d="M12 7 17 12 12 17 7 12Z" />
    </svg>
  );
}

/** 让层级、尺寸和实际执行反馈可以一起试用。 */
function ButtonPlayground() {
  const [variant, setVariant] = useState<(typeof variants)[number]>('primary');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [state, setState] = useState('idle');
  const [count, setCount] = useState(0);
  return (
    <div className="example-playground">
      <div className="example-controls">
        <label>
          操作层级
          <select value={variant} onChange={(e) => setVariant(e.target.value as typeof variant)}>
            {variants.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          按钮尺寸
          <select value={size} onChange={(e) => setSize(e.target.value as typeof size)}>
            {['sm', 'md', 'lg'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          按钮状态
          <select value={state} onChange={(e) => setState(e.target.value)}>
            <option value="idle">静止</option>
            <option value="disabled">禁用</option>
            <option value="loading">加载</option>
          </select>
        </label>
      </div>
      <div className="example-focus">
        <Button
          variant={variant}
          size={size}
          disabled={state === 'disabled'}
          loading={state === 'loading'}
          trailingIcon={actionArrow}
          onClick={() => setCount(count + 1)}
        >
          开始创作
        </Button>
        <span role="status">已执行 {count} 次</span>
      </div>
      <code className="example-live-code">{`<Button variant="${variant}" size="${size}"${state === 'disabled' ? ' disabled' : state === 'loading' ? ' loading' : ''}>开始创作</Button>`}</code>
    </div>
  );
}

/** 持续选中与瞬时按压分别演示，操作结果保留在内容区。 */
function ButtonSelection() {
  const [view, setView] = useState('图形');
  const [saved, setSaved] = useState(false);
  return (
    <div className="example-stack">
      <div className="preview-actions" role="group" aria-label="工作区视图">
        {['图形', '数据', '记录'].map((name) => (
          <Button key={name} variant="outline" aria-pressed={view === name} onClick={() => setView(name)}>
            {name}
          </Button>
        ))}
        <IconButton
          variant="secondary"
          aria-label="收藏当前视图"
          aria-pressed={saved}
          onClick={() => setSaved(!saved)}
        >
          {bookmarkIcon}
        </IconButton>
      </div>
      <StatusIndicator
        tone={saved ? 'success' : 'info'}
        label={`当前显示${view}视图${saved ? '，已收藏' : ''}`}
      />
    </div>
  );
}

/** 对比静止、加载和禁用，禁用操作保持静态等价形态。 */
function ButtonStates() {
  return (
    <div className="button-state-matrix">
      <span /> <small>静止</small>
      <small>加载</small>
      <small>禁用</small>
      {variants.map((variant, index) => (
        <div className="button-state-row" key={variant}>
          <small>{variant}</small>
          <Button variant={variant}>{labels[index]}</Button>
          <Button variant={variant} loading>
            正在处理
          </Button>
          <Button variant={variant} disabled>
            等待开放
          </Button>
        </div>
      ))}
    </div>
  );
}

/** 使用真实输入触发校验，编辑时保留内容。 */
function ValidationDemo() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <form
      className="example-stack"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <Field
        label="项目名称"
        required
        error={submitted && !name.trim() ? '填写项目名称后即可保存。' : undefined}
        description="用于在团队中识别项目。"
      >
        {(props) => (
          <Input
            {...props}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSubmitted(false);
            }}
            placeholder="例如：春日灵感集"
          />
        )}
      </Field>
      <Button type="submit">保存项目</Button>
      {submitted && name.trim() && <span role="status">已保存：{name}</span>}
    </form>
  );
}

function MarkDemo() {
  const [phase, setPhase] = useState<'drawing' | 'erasing' | 'static'>('drawing');
  const [run, setRun] = useState(0);
  return (
    <>
      <div className="preview-stage">
        <LoadingMark key={run} phase={phase} label="加载标记" />
      </div>
      <div className="preview-actions">
        <Button
          onClick={() => {
            setRun(run + 1);
            setPhase('drawing');
          }}
        >
          重新绘制
        </Button>
        <Button variant="secondary" onClick={() => setPhase('erasing')}>
          撤回描边
        </Button>
        <Button variant="ghost" onClick={() => setPhase('static')}>
          静态
        </Button>
      </div>
    </>
  );
}

function ProgressDemo() {
  const [value, setValue] = useState(64);
  return (
    <div className="example-stack">
      <Progress value={value} label="资料导入进度" />
      <label>
        完成比例 {value}%
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
      </label>
      <Progress label="正在等待结果" />
    </div>
  );
}

function ResultDemo() {
  const [status, setStatus] = useState<'success' | 'error' | 'not-found' | 'session-expired' | 'forbidden'>(
    'success',
  );
  return (
    <>
      <label className="example-controls">
        结果状态
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          {Object.entries({
            success: '操作完成',
            error: '处理失败',
            'not-found': '页面未找到',
            'session-expired': '登录过期',
            forbidden: '访问受限',
          }).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <Result
        status={status}
        description="保留当前资料，并提供下一步操作。"
        actions={<Button onClick={() => setStatus('success')}>返回工作区</Button>}
      />
    </>
  );
}

const options = [
  { value: 'design', label: '设计资料' },
  { value: 'research', label: '调研记录' },
  { value: 'archive', label: '历史归档', disabled: true },
];
const tones = ['neutral', 'info', 'success', 'warning', 'danger'] as const;
const toneLabels = ['草稿', '进行中', '已完成', '待确认', '处理失败'];

/** 在共享组件示例之外补充有明确用途的状态和组合。 */
export const extraExamples: Record<string, Example[]> = {
  Button: [
    {
      id: 'variants',
      title: '操作层级',
      description:
        '首次悬停播放局部刻面闪切，后续悬停直接显示稳定高亮。边缘细线随机分布，伸缩与位移在每次交互中保持一致。',
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
        '静止显示清晰边框，加载使用专用图标与基线扫描，禁用保持静态轮廓。刻面在入场与首次交互时播放，后续交互保持稳定高亮，选中和展开状态通过左侧标记与加厚底线表达。',
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
          <IconButton aria-label="添加项目">＋</IconButton>
          <Button variant="outline" leadingIcon={bookmarkIcon} trailingIcon={actionArrow}>
            查看团队整理的全部设计资料与审阅记录
          </Button>
        </div>
      ),
      code: '<Button size="sm">小尺寸</Button>\n<Button size="md">中尺寸</Button>\n<Button size="lg">大尺寸</Button>\n<IconButton aria-label="添加项目">＋</IconButton>\n<Button leadingIcon={bookmarkIcon} trailingIcon={actionArrow}>查看团队整理的全部设计资料与审阅记录</Button>',
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
            <Button
              loading
              loadingIcon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path className="demo-loader-orbit" d="M5 5h14v14H5Z" strokeDasharray="9 5" />
                </svg>
              }
            >
              局部加载图标
            </Button>
            <IconButton loading aria-label="同步资料">
              <span>↻</span>
            </IconButton>
          </div>
        </AigProvider>
      ),
      code: `const loadingIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <circle className="loading-orbit" cx="12" cy="12" r="10" strokeDasharray="14 8" />
  <path d="M12 7 17 12 12 17 7 12Z" />
</svg>;
<AigProvider brand={{ loadingIcon }}>
  <Button loading>正在保存</Button>
  <Button loading loadingIcon={<MyLoadingSvg />}>局部覆盖</Button>
</AigProvider>
/* 宿主控制自定义 SVG 内部动效。 */
.loading-orbit { transform-origin: 12px 12px; animation: orbit 7s linear infinite; }
@keyframes orbit { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .loading-orbit { animation: none; } }`,
    },
  ],
  LoadingMark: [
    {
      id: 'drawing',
      title: '绘制与反向撤回',
      description: '从当前描边位置撤回，双环保持相反方向的运行节奏。',
      render: () => <MarkDemo />,
      code: '<LoadingMark phase="drawing" label="加载标记" />',
      wide: true,
    },
  ],
  LoadingSequence: [
    {
      id: 'sequence',
      title: '完整加载交接',
      description: '重播、暂停、慢速、失败恢复和原版对照。任务就绪后完成撤回与内容交接。',
      render: () => <SequenceDemo />,
      code: '<LoadingSequence taskId={taskId} status={status}>\n  <Workspace />\n</LoadingSequence>',
      wide: true,
    },
  ],
  Input: [
    {
      id: 'states',
      title: '只读、禁用与错误',
      description: '保持输入文字稳定，用基线和说明区分状态。',
      render: () => (
        <div className="example-stack">
          <Field label="只读编号">{(p) => <Input {...p} readOnly value="AIG-2026-0912" />}</Field>
          <Field label="等待开通" description="团队空间开通后可编辑。">
            {(p) => <Input {...p} disabled value="团队空间" />}
          </Field>
          <Field label="资料名称" error="填写名称后即可继续。">
            {(p) => <Input {...p} />}
          </Field>
        </div>
      ),
      code: '<Input readOnly value="AIG-2026-0912" />\n<Input disabled value="团队空间" />\n<Input aria-invalid="true" />',
    },
    {
      id: 'validation',
      title: '表单校验',
      description: '提交触发必填校验，继续编辑时保留输入。',
      render: () => <ValidationDemo />,
      code: '<Field label="项目名称" required error={error}>\n  {(props) => <Input {...props} value={name} onChange={handleChange} />}\n</Field>',
    },
  ],
  Field: [
    {
      id: 'validation',
      title: '校验与恢复',
      description: '标签、必填提示、错误说明与输入关联。',
      render: () => <ValidationDemo />,
      code: '<Field label="项目名称" required error={error}>\n  {(props) => <Input {...props} />}\n</Field>',
    },
  ],
  Textarea: [
    {
      id: 'states',
      title: '长文本与禁用',
      description: '页边线为连续阅读留出空间，文本域可向下拉伸。',
      render: () => (
        <div className="example-stack">
          <Textarea
            aria-label="项目说明"
            rows={4}
            defaultValue="把零散的想法整理成一份清晰的提案。\n记录背景、设计目标和下一步安排。"
          />
          <Textarea aria-label="归档说明" disabled defaultValue="这份资料已归档。" />
        </div>
      ),
      code: '<Textarea aria-label="项目说明" rows={4} />\n<Textarea aria-label="归档说明" disabled defaultValue="这份资料已归档。" />',
    },
  ],
  Checkbox: [
    {
      id: 'states',
      title: '选择状态',
      description: '方形结构容纳对勾，中间态表示部分选中。',
      render: () => (
        <div className="example-stack">
          <label>
            <Checkbox defaultChecked /> 同步项目资料
          </label>
          <label>
            <Checkbox indeterminate /> 部分资料已选择
          </label>
          <label>
            <Checkbox disabled /> 等待开放
          </label>
          <label>
            <Checkbox defaultChecked disabled /> 已锁定的选择
          </label>
        </div>
      ),
      code: '<Checkbox defaultChecked />\n<Checkbox indeterminate />\n<Checkbox disabled />\n<Checkbox defaultChecked disabled />',
    },
  ],
  Switch: [
    {
      id: 'states',
      title: '开启、关闭与锁定',
      description: '圆形内核沿轨道平移，静止时保持轻微巡行。',
      render: () => (
        <div className="example-stack">
          <label>
            <Switch defaultChecked /> 自动保存
          </label>
          <label>
            <Switch /> 邮件通知
          </label>
          <label>
            <Switch disabled /> 等待管理员开放
          </label>
          <label>
            <Switch disabled defaultChecked /> 组织已启用
          </label>
        </div>
      ),
      code: '<Switch defaultChecked />\n<Switch />\n<Switch disabled />\n<Switch disabled defaultChecked />',
    },
  ],
  RadioGroup: [
    {
      id: 'disabled',
      title: '部分选项锁定',
      description: '选中内核和下划线共同提示当前值。',
      render: () => <RadioGroup label="资料类型" options={options} defaultValue="design" />,
      code: '<RadioGroup label="资料类型" defaultValue="design" options={options} />',
    },
  ],
  Select: [
    {
      id: 'states',
      title: '占位、禁用与失效值',
      description: '展开选择器体验可用和禁用选项，失效值仍保留可读提示。',
      render: () => (
        <div className="example-stack">
          <Select label="选择资料类型" options={options} />
          <Select label="锁定资料类型" options={options} disabled defaultValue="design" />
          <Select label="已失效资料类型" options={options} defaultValue="old" />
          <Select label="空选项" options={[]} />
        </div>
      ),
      code: '<Select label="选择资料类型" options={options} />\n<Select label="锁定资料类型" options={options} disabled />\n<Select label="空选项" options={[]} />',
    },
  ],
  Combobox: [
    {
      id: 'states',
      title: '检索与空结果',
      description: '按名称检索资料，保留禁用选项和空结果说明。',
      render: () => (
        <div className="example-stack">
          <Combobox label="检索资料类型" options={options} placeholder="输入设计或调研" />
          <Combobox label="锁定检索" options={options} disabled defaultValue="design" />
        </div>
      ),
      code: '<Combobox label="检索资料类型" options={options} />\n<Combobox label="锁定检索" options={options} disabled />',
    },
  ],
  Card: [
    {
      id: 'materials',
      title: '材质与内容层级',
      description: '玻璃表面承载概览，实色表面适合长时间阅读。',
      render: () => (
        <div className="example-pair">
          <Card material="glass">
            <small>DESIGN NOTES</small>
            <h3>一束光，一条线。</h3>
            <p>柔和环境中的轻盈表面。</p>
            <Badge tone="info">持续演进</Badge>
          </Card>
          <Card material="solid">
            <small>READING ROOM</small>
            <h3>给内容留白。</h3>
            <p>清楚的层次，专注的阅读。</p>
            <Button variant="ghost">阅读记录</Button>
          </Card>
        </div>
      ),
      code: '<Card material="glass">柔和玻璃</Card>\n<Card material="solid">阅读表面</Card>',
      wide: true,
    },
  ],
  Panel: [
    {
      id: 'layout',
      title: '内容与操作分区',
      description: '侧轨标记主区域，页头和页脚形成稳定的阅读边界。',
      render: () => (
        <Panel>
          <Panel.Header>项目资料</Panel.Header>
          <Panel.Body>
            <p>已整理 12 份设计资料，等待团队审阅。</p>
            <Progress value={80} label="整理进度" />
          </Panel.Body>
          <Panel.Footer>
            <Button>继续整理</Button>
          </Panel.Footer>
        </Panel>
      ),
      code: '<Panel>\n  <Panel.Header>项目资料</Panel.Header>\n  <Panel.Body>资料内容</Panel.Body>\n  <Panel.Footer><Button>继续整理</Button></Panel.Footer>\n</Panel>',
      wide: true,
    },
  ],
  Badge: [
    {
      id: 'tones',
      title: '状态语义',
      description: '紧凑胶囊轮廓配合文字与状态色。',
      render: () => (
        <div className="preview-actions">
          {tones.map((tone, i) => (
            <Badge key={tone} tone={tone}>
              {toneLabels[i]}
            </Badge>
          ))}
        </div>
      ),
      code: tones.map((tone, i) => `<Badge tone="${tone}">${toneLabels[i]}</Badge>`).join('\n'),
    },
  ],
  StatusIndicator: [
    {
      id: 'tones',
      title: '持续状态',
      description: '核心缓慢巡行，运行中的状态增加轨道运动。',
      render: () => (
        <div className="example-stack">
          {tones.map((tone, i) => (
            <StatusIndicator key={tone} tone={tone} label={toneLabels[i]!} busy={tone === 'info'} />
          ))}
        </div>
      ),
      code: '<StatusIndicator tone="success" label="已完成" />\n<StatusIndicator tone="info" label="进行中" busy />',
    },
  ],
  Progress: [
    {
      id: 'interactive',
      title: '调整实际进度',
      description: '拖动滑块对比已知进度与未知进度。',
      render: () => <ProgressDemo />,
      code: '<Progress value={64} label="资料导入进度" />\n<Progress label="正在等待结果" />',
    },
  ],
  Alert: [
    {
      id: 'tones',
      title: '提示层级',
      description: '文字、侧轨与语义色一起表达消息的性质。',
      render: () => (
        <div className="example-stack">
          {tones.slice(1).map((tone, i) => (
            <Alert key={tone} tone={tone} title={toneLabels[i + 1]}>
              当前资料已保留，可继续查看详情。
            </Alert>
          ))}
        </div>
      ),
      code: '<Alert tone="info" title="进行中">正在处理资料。</Alert>\n<Alert tone="danger" title="处理失败">当前资料已保留。</Alert>',
    },
  ],
  Result: [
    {
      id: 'states',
      title: '结果与恢复操作',
      description: '切换全部结果类型，查看文案与恢复入口。',
      render: () => <ResultDemo />,
      code: '<Result status="success" description="资料已保留。" actions={<Button>返回工作区</Button>} />',
      wide: true,
    },
  ],
  Tabs: [
    {
      id: 'disabled',
      title: '锁定页签',
      description: '键盘切换跳过禁用项，活动标记保持巡行。',
      render: () => (
        <Tabs.Root defaultValue="overview">
          <Tabs.List aria-label="资料视图">
            <Tabs.Tab value="overview">概览</Tabs.Tab>
            <Tabs.Tab value="history">更新记录</Tabs.Tab>
            <Tabs.Tab value="locked" disabled>
              团队分析
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">资料与团队概览。</Tabs.Panel>
          <Tabs.Panel value="history">今天更新了设计记录。</Tabs.Panel>
        </Tabs.Root>
      ),
      code: '<Tabs.Tab value="locked" disabled>团队分析</Tabs.Tab>',
    },
  ],
  TaskStatus: [
    {
      id: 'states',
      title: '任务生命周期',
      description: '等待、执行、确认和完成采用不同的状态标记。',
      render: () => (
        <div className="example-stack">
          {(
            [
              'idle',
              'queued',
              'running',
              'streaming',
              'awaiting-confirmation',
              'succeeded',
              'failed',
              'cancelled',
            ] as const
          ).map((status) => (
            <TaskStatus key={status} status={status} />
          ))}
        </div>
      ),
      code: '<TaskStatus status="running" />\n<TaskStatus status="awaiting-confirmation" />\n<TaskStatus status="succeeded" />',
    },
  ],
};
