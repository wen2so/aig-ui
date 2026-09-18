import { componentStories, pageMetadata } from './catalog.js';
import { loadExtraExamples, type Example } from './examples.js';

export const groups = [
  {
    label: '通用',
    caption: '操作、图标与排版',
    names: 'Button IconButton CopyButton Icon Text Heading Link',
  },
  {
    label: '布局',
    caption: '分区与内容结构',
    names: 'Flex Space Grid Layout Splitter Panel Separator PageHeader',
  },
  {
    label: '导航',
    caption: '页面与内容切换',
    names: 'Navigation Breadcrumb DropdownMenu Pagination Tabs Steps Anchor',
  },
  {
    label: '数据录入',
    caption: '输入与选择',
    names: 'Field Input Textarea Checkbox RadioGroup Switch Select Combobox',
  },
  {
    label: '数据展示',
    caption: '内容、数据与补充说明',
    names: 'Table Card DescriptionList Badge StatusIndicator Accordion EmptyState Popover Tooltip',
  },
  {
    label: '反馈',
    caption: '状态与回应',
    names: 'Alert Dialog Drawer Toast Progress Spinner Skeleton Result',
  },
  { label: '动效', caption: '从等待到就绪', names: 'LoadingMark LoadingSequence' },
  {
    label: 'AI',
    caption: '与智能协作',
    names: 'PromptInput Message Conversation SourceList TaskStatus ToolResult ArtifactPreview Confirmation',
  },
  {
    label: '页面组合',
    caption: '完整的工作场景',
    names: 'visual-study access-state-page settings-form filterable-list ai-assistant artifact-review',
  },
  { label: '主题', caption: '作用域与品牌', names: 'AigProvider' },
];

/** 常见控件名称用于检索；映射保留本库公开名称，不承诺其他组件库的 API。 */
const aliases: Record<string, string> = {
  Text: 'Typography 排版',
  Heading: 'Typography 排版',
  Separator: 'Divider 分割线',
  Navigation: 'Menu 导航菜单',
  DropdownMenu: 'Dropdown 下拉菜单',
  Textarea: 'Input.TextArea 多行输入',
  RadioGroup: 'Radio 单选框',
  Combobox: '可搜索选择器',
  Badge: 'Tag 标签',
  DescriptionList: 'Descriptions 描述列表',
  Accordion: 'Collapse 折叠面板',
  EmptyState: 'Empty 空状态',
  Dialog: 'Modal 模态框',
  Toast: '全局提示 轻提示 通知提醒',
  Spinner: 'Spin 加载中',
  AigProvider: 'ConfigProvider 全局配置',
};

const rawFiles = import.meta.glob('../../../packages/aig-ui/src/**/*.{stories.tsx,md}', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;
const pageSource = import.meta.glob(['./pages.tsx', './visual-study.tsx'], {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

export interface Entry {
  name: string;
  label: string;
  description: string;
  group: string;
  load: () => Promise<EntryDetail>;
  importPath: string;
  aliases: string;
}

export interface EntryDetail {
  examples: Example[];
  readme: string;
}

const special = [
  { name: 'Button', label: '按钮', description: '用清晰的操作层级，让每一次行动都有回应。' },
  { name: 'LoadingMark', label: '加载标记', description: '几何图形逐段建立，双环协同运行，描边沿原路撤回。' },
  { name: 'LoadingSequence', label: '加载序列', description: '从等待到就绪，用连续的动效把画面交给内容。' },
];

/** 分类、示例和源码共用一份目录，支持稳定的组件直达地址。 */
export const entries: Entry[] = [
  ...special.map((entry) => ({
    ...entry,
    loadPreview: async () => (await loadExtraExamples(entry.name))[0]!.render,
  })),
  ...componentStories.map((story) => ({
    ...story.preview,
    loadPreview: async () => {
      const module = await story.load();
      return () => <module.Preview />;
    },
  })),
  ...pageMetadata.map((entry) => ({
    ...entry,
    loadPreview: async () =>
      (await import('./pages.js')).pageEntries.find((page) => page.name === entry.name)!.render,
  })),
]
  .map((entry) => {
    const group = groups.find((group) => group.names.split(' ').includes(entry.name))!.label;
    const id = entry.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const directory =
      group === 'AI'
        ? `ai/${id}`
        : group === '动效'
          ? 'motion'
          : group === '主题'
            ? 'theme'
            : `components/${id}`;
    const prefix = `../../../packages/aig-ui/src/${directory}`;
    const load = async (): Promise<EntryDetail> => {
      const [render, extras, readme, code] = await Promise.all([
        entry.loadPreview(),
        loadExtraExamples(entry.name),
        rawFiles[`${prefix}/README.md`]?.() ?? Promise.resolve(''),
        group === '页面组合'
          ? pageSource[entry.name === 'visual-study' ? './visual-study.tsx' : './pages.tsx']!()
          : (rawFiles[`${prefix}/${id}.stories.tsx`]?.() ?? Promise.resolve('')),
      ]);
      const examples = special.some((item) => item.name === entry.name)
        ? extras
        : [
            {
              id: 'basic',
              title: '基本用法',
              description: entry.description,
              render,
              code,
              wide:
                ['页面组合', 'AI', '主题'].includes(group) ||
                ['Table', 'Conversation', 'Panel'].includes(entry.name),
            },
            ...extras,
          ];
      return { examples, readme };
    };
    return {
      ...entry,
      group,
      aliases: aliases[entry.name] ?? '',
      load,
      importPath:
        entry.name === 'visual-study'
          ? '预览页操作样板'
          : group === '页面组合'
            ? 'Registry 页面源码'
            : group === '动效'
              ? 'aig-ui/motion'
              : group === 'AI'
                ? `aig-ui/ai/${id}`
                : group === '主题'
                  ? 'aig-ui'
                  : `aig-ui/${id}`,
    };
  })
  .sort((a, b) => {
    const groupDifference =
      groups.findIndex((g) => g.label === a.group) - groups.findIndex((g) => g.label === b.group);
    if (groupDifference) return groupDifference;
    const names = groups.find((group) => group.label === a.group)!.names.split(' ');
    return names.indexOf(a.name) - names.indexOf(b.name);
  });
