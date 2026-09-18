import { ArrowRight, Bookmark, Plus, RotateCcw, LoaderCircle } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import {
  Button,
  Icon,
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

const variants = ['primary', 'secondary', 'outline', 'ghost'] as const;
const labels = ['开始创作', '保存草稿', '查看详情', '更多操作'];
const actionArrow = <Icon icon={ArrowRight} />;
const bookmarkIcon = <Icon icon={Bookmark} />;

/** 自定义加载图标沿用 Lucide 轮廓与现有旋转节奏。 */
function CustomLoadingIcon() {
  return <Icon icon={LoaderCircle} className="demo-loader-orbit" />;
}

/** 用独立选中状态复现参考菜单的入场收束，不将焦点、悬停当作业务选择。 */
function ButtonReference() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="button-reference" role="group" aria-label="菜单入场演示">
      {['音频语言', '文字语言', '字幕', '字幕大小'].map((label, index) => (
        <div className="button-reference-item" key={label}>
          <Button size="sm" aria-pressed={selected === index} onClick={() => setSelected(index)}>
            {label}
          </Button>
          <span aria-hidden="true">{['中文', '中文', '开启', '标准'][index]}</span>
        </div>
      ))}
    </div>
  );
}

/** 让层级、尺寸和实际执行反馈可以一起试用。 */
function ButtonPlayground() {
  const [variant, setVariant] = useState<(typeof variants)[number]>('primary');
  const [tone, setTone] = useState<'brand' | (typeof tones)[number]>('brand');
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
          语义颜色
          <select value={tone} onChange={(e) => setTone(e.target.value as typeof tone)}>
            {['brand', ...tones].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          按钮状态
          <select value={state} onChange={(e) => setState(e.target.value)}>
            <option value="idle">默认</option>
            <option value="disabled">禁用</option>
            <option value="loading">加载</option>
          </select>
        </label>
      </div>
      <div className="example-focus">
        <Button
          variant={variant}
          tone={tone}
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
      <code className="example-live-code">{`<Button variant="${variant}" tone="${tone}" size="${size}"${state === 'disabled' ? ' disabled' : state === 'loading' ? ' loading' : ''}>开始创作</Button>`}</code>
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

/** 同一外观只对比三种状态，其他组合通过试验台查看。 */
function ButtonStates() {
  return (
    <div className="button-state-matrix">
      <span /> <small>默认</small>
      <small>加载</small>
      <small>禁用</small>
      <div className="button-state-row">
        <small>primary</small>
        <Button>保存设置</Button>
        <Button loading>正在处理</Button>
        <Button disabled>等待开放</Button>
      </div>
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
export {
  ArrowRight,
  Bookmark,
  Plus,
  RotateCcw,
  LoaderCircle,
  useState,
  Button,
  Icon,
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
  TaskStatus,
  LoadingMark,
  SequenceDemo,
  variants,
  labels,
  actionArrow,
  bookmarkIcon,
  CustomLoadingIcon,
  ButtonReference,
  ButtonPlayground,
  ButtonSelection,
  ButtonStates,
  ValidationDemo,
  MarkDemo,
  ProgressDemo,
  ResultDemo,
  options,
  tones,
  toneLabels,
};
