import { componentStories } from './catalog.js';
import { pageEntries } from './pages.js';
import { extraExamples, type Example } from './examples.js';

export const groups = [
  { label: '通用', caption: '动作与文字', names: 'Button IconButton CopyButton Link Text Heading Icon' },
  { label: '布局', caption: '内容的秩序', names: 'Card Panel Separator PageHeader' },
  { label: '导航', caption: '流畅地抵达', names: 'Navigation Breadcrumb Tabs Pagination DropdownMenu' },
  {
    label: '数据录入',
    caption: '输入与选择',
    names: 'Field Input Textarea Checkbox RadioGroup Switch Select Combobox',
  },
  {
    label: '数据展示',
    caption: '让信息清晰',
    names: 'Table Badge DescriptionList Accordion Tooltip Popover',
  },
  {
    label: '反馈',
    caption: '状态与回应',
    names: 'Alert Dialog Drawer Toast Progress Spinner Skeleton StatusIndicator EmptyState Result',
  },
  { label: '动效', caption: '有巡行的界面', names: 'LoadingMark LoadingSequence' },
  {
    label: 'AI',
    caption: '与智能协作',
    names: 'PromptInput Message Conversation SourceList TaskStatus ToolResult ArtifactPreview Confirmation',
  },
  {
    label: '页面组合',
    caption: '完整的工作场景',
    names: 'access-state-page settings-form filterable-list ai-assistant artifact-review',
  },
];

const rawFiles = import.meta.glob('../../../packages/aig-ui/src/**/*.{stories.tsx,md}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const pageSource = import.meta.glob('./pages.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export interface Entry {
  name: string;
  label: string;
  description: string;
  group: string;
  examples: Example[];
  readme: string;
  importPath: string;
}

const special = [
  { name: 'Button', label: '按钮', description: '用清晰的操作层级，让每一次行动都有回应。' },
  { name: 'LoadingMark', label: '加载标记', description: '几何图形逐段建立，双环协同运行，描边沿原路撤回。' },
  { name: 'LoadingSequence', label: '加载序列', description: '从等待到就绪，用连续的动效把画面交给内容。' },
];

/** 分类、示例和源码共用一份目录，支持稳定的组件直达地址。 */
export const entries: Entry[] = [
  ...special.map((entry) => ({ ...entry, render: extraExamples[entry.name]![0]!.render })),
  ...componentStories.map((story) => ({ ...story.preview, render: () => <story.Preview /> })),
  ...pageEntries,
]
  .map((entry) => {
    const group = groups.find((group) => group.names.split(' ').includes(entry.name))!.label;
    const id = entry.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const directory = group === 'AI' ? `ai/${id}` : group === '动效' ? 'motion' : `components/${id}`;
    const prefix = `../../../packages/aig-ui/src/${directory}`;
    const extras = extraExamples[entry.name] ?? [];
    const examples = special.some((item) => item.name === entry.name)
      ? extras
      : [
          {
            id: 'basic',
            title: '基本用法',
            description: entry.description,
            render: entry.render,
            code:
              group === '页面组合' ? pageSource['./pages.tsx']! : rawFiles[`${prefix}/${id}.stories.tsx`]!,
            wide:
              ['页面组合', 'AI'].includes(group) || ['Table', 'Conversation', 'Panel'].includes(entry.name),
          },
          ...extras,
        ];
    return {
      ...entry,
      group,
      examples,
      readme: rawFiles[`${prefix}/README.md`] ?? '',
      importPath:
        group === '页面组合'
          ? 'Registry 页面源码'
          : group === '动效'
            ? 'aig-ui/motion'
            : group === 'AI'
              ? `aig-ui/ai/${id}`
              : `aig-ui/${id}`,
    };
  })
  .sort(
    (a, b) => groups.findIndex((g) => g.label === a.group) - groups.findIndex((g) => g.label === b.group),
  );
