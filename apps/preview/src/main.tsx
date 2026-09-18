import '@fontsource/inter/latin-300.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource/jetbrains-mono/latin-600.css';
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, X, Plus, Minus, Grid2X2 } from 'lucide-react';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  StrictMode,
  lazy,
  Suspense,
  type MouseEvent,
} from 'react';
import { createRoot } from 'react-dom/client';
import { AigProvider, Icon, Accordion, BrandMark, CopyButton } from 'aig-ui';
import { CatalogOverview } from './catalog-overview.js';
import {
  brandShapes,
  BrandControls,
  defaultFontChoice,
  defaultPalette,
  resolveFont,
  type FontChoice,
} from './brand-controls.js';
import '../../../packages/aig-ui/src/styles.css';
import '../../../packages/aig-ui/src/motion/styles.css';
import '../../../packages/aig-ui/src/ai/styles.css';
import './preview.css';
import { entries, groups } from './catalog-model.js';
import { ExampleCard, ApiTable } from './detail-components.js';
import { useEntryDetail } from './use-entry-detail.js';

const SafeMarkdown = lazy(() =>
  import('../../../packages/aig-ui/src/ai/safe-markdown.js').then((module) => ({
    default: module.SafeMarkdown,
  })),
);

/** 分类锚点同时供顶部导航、直达地址和浏览器历史使用。 */
const catalogId = (group: string) =>
  ({
    通用: 'catalog-components',
    动效: 'catalog-motion',
    页面组合: 'catalog-pages',
    主题: 'catalog-theme',
  })[group] ?? `catalog-${group}`;
/** 顶部导航覆盖总览的组件、动效、页面组合与主题分组。 */
const navGroups = [
  { label: '组件', group: '通用' },
  { label: '动效', group: '动效' },
  { label: '页面组合', group: '页面组合' },
  { label: '主题', group: '主题' },
];

/** 原生链接保留新标签打开和复制地址，普通点击使用本地导航。 */
function Preview() {
  const [selected, setSelected] = useState(() => new URLSearchParams(location.search).get('component') ?? '');
  const [navigation, setNavigation] = useState(0);
  const [section, setSection] = useState(() => location.hash);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('全部');
  const [menuOpen, setMenuOpen] = useState(false);
  const [material, setMaterial] = useState<'glass' | 'solid'>('glass');
  const [ambient, setAmbient] = useState(true);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [palette, setPalette] = useState(defaultPalette);
  const [brandColor, setBrandColor] = useState('#b98b90');
  const [brandShape, setBrandShape] = useState('triangle');
  const [font, setFont] = useState<FontChoice>(defaultFontChoice);
  const searchInput = useRef<HTMLInputElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const entry = entries.find((entry) => entry.name === selected);
  const { detail, error, retry } = useEntryDetail(entry);
  const query = search.trim().toLocaleLowerCase();
  const matches = entries.filter((entry) =>
    `${entry.name} ${entry.label} ${entry.group} ${entry.description} ${entry.aliases}`
      .toLocaleLowerCase()
      .includes(query),
  );
  const visible = matches.filter((entry) => category === '全部' || entry.group === category);

  useEffect(() => {
    const restoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    const onPopState = () => {
      setSelected(new URLSearchParams(location.search).get('component') ?? '');
      setSearch('');
      setCategory('全部');
      setMenuOpen(false);
      setSection(location.hash);
      setNavigation((value) => value + 1);
    };
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        if (document.querySelector('[role="dialog"]')) return;
        event.preventDefault();
        searchInput.current?.focus();
      }
      if (event.key === 'Escape') {
        if (sidebar.current?.contains(document.activeElement)) menuToggle.current?.focus();
        setMenuOpen(false);
        searchInput.current?.blur();
      }
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('keydown', onKey);
    return () => {
      history.scrollRestoration = restoration;
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('keydown', onKey);
    };
  }, []);
  useLayoutEffect(() => {
    if (entry && !detail) return;
    let anchor = location.hash.slice(1);
    try {
      anchor = decodeURIComponent(anchor);
    } catch {
      // 手动输入的未完成转义按原文查找，正文仍可正常导航。
    }
    const target = document.getElementById(anchor);
    const behavior =
      navigation === 0 || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    if (target) target.scrollIntoView({ behavior, block: 'start' });
    else window.scrollTo({ top: 0, behavior });
    (target ?? title.current)?.focus({ preventScroll: true });
  }, [entry, navigation, detail]);

  useEffect(() => {
    const nav = sidebar.current?.querySelector('nav');
    const active = nav?.querySelector('[aria-current="page"]');
    if (!nav || !active) return;
    const bounds = nav.getBoundingClientRect();
    const item = active.getBoundingClientRect();
    // 只移动目录自身，避免目录定位覆盖正文的滚动目标。
    if (item.top < bounds.top) nav.scrollTop += item.top - bounds.top - 8;
    else if (item.bottom > bounds.bottom) nav.scrollTop += item.bottom - bounds.bottom + 8;
  }, [entry, menuOpen, query]);

  useEffect(() => {
    document.title = query
      ? '搜索结果 · aig-ui'
      : entry
        ? `${entry.label} ${entry.name} · aig-ui`
        : '组件总览 · aig-ui';
    if (query) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [entry, query]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, name: string, anchor = '') {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const href = `${location.pathname}${name ? `?component=${encodeURIComponent(name)}` : ''}${anchor}`;
    if (`${location.pathname}${location.search}${location.hash}` !== href) history.pushState(null, '', href);
    setSelected(name);
    setSearch('');
    setCategory('全部');
    setMenuOpen(false);
    setSection(anchor);
    setNavigation((value) => value + 1);
  }
  const link = (name: string, anchor = '') => ({
    href: `${location.pathname}${name ? `?component=${encodeURIComponent(name)}` : ''}${anchor}`,
    onClick: (event: MouseEvent<HTMLAnchorElement>) => navigate(event, name, anchor),
  });
  /** 恢复默认覆盖全局主题的全部选项，抽屉不再单独记录默认值。 */
  function resetTheme() {
    setPalette(defaultPalette);
    setBrandColor('#b98b90');
    setBrandShape('triangle');
    setMaterial('glass');
    setDensity('comfortable');
    setAmbient(true);
    setFont(defaultFontChoice);
  }
  const activeSection =
    entry && !query
      ? catalogId(navGroups.some((item) => item.group === entry.group) ? entry.group : '通用')
      : section.slice(1) || 'catalog-components';

  return (
    <AigProvider
      className="preview-shell"
      material={material}
      density={density}
      brand={{ color: brandColor, mark: brandShapes[brandShape] }}
      palette={palette}
      font={resolveFont(font)}
      data-ambient={ambient ? 'running' : 'paused'}
    >
      <a className="skip-link" href="#content">
        跳到主要内容
      </a>
      <header className="site-header">
        <a className="preview-brand" {...link('')} aria-label="aig-ui 组件总览">
          <BrandMark />
          aig<span>ui</span>
          <small>DESIGN SYSTEM</small>
        </a>
        <nav className="site-nav" aria-label="主导航">
          {navGroups.map((item) => {
            const id = catalogId(item.group);
            return (
              <a
                key={item.label}
                {...link('', `#${id}`)}
                aria-current={activeSection === id ? 'location' : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <label className="site-search">
          <Icon icon={Search} size={16} />
          <input
            ref={searchInput}
            aria-label="查找组件"
            placeholder="搜索组件、用途…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCategory('全部');
            }}
          />
          <kbd>Ctrl K</kbd>
          {search && (
            <button onClick={() => setSearch('')} aria-label="清空搜索">
              <Icon icon={X} size={14} />
            </button>
          )}
        </label>
        <span className="site-version">
          0.1.0 <span>ALPHA</span>
        </span>
        <BrandControls
          palette={palette}
          onPaletteChange={setPalette}
          color={brandColor}
          shape={brandShape}
          material={material}
          density={density}
          ambient={ambient}
          font={font}
          onColorChange={setBrandColor}
          onShapeChange={setBrandShape}
          onMaterialChange={setMaterial}
          onDensityChange={setDensity}
          onAmbientChange={setAmbient}
          onFontChange={setFont}
          onReset={resetTheme}
        />
        <button
          ref={menuToggle}
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="component-nav"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          组件目录 <Icon icon={menuOpen ? Minus : Plus} size={16} />
        </button>
      </header>
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="关闭组件目录"
          onClick={() => {
            setMenuOpen(false);
            menuToggle.current?.focus();
          }}
        />
      )}
      <aside ref={sidebar} className="preview-sidebar" data-open={menuOpen || undefined} id="component-nav">
        <a className="overview-link" {...link('')} aria-current={!entry ? 'page' : undefined}>
          <Icon icon={Grid2X2} size={16} /> 组件总览 <small>{entries.length}</small>
        </a>
        <nav aria-label="组件目录">
          {groups.map((group) => {
            const items = matches.filter((entry) => entry.group === group.label);
            return (
              items.length > 0 && (
                <div className="sidebar-group" key={group.label}>
                  <h2>
                    {group.label}
                    <span>{items.length}</span>
                  </h2>
                  {items.map((item) => (
                    <a
                      key={item.name}
                      {...link(item.name)}
                      aria-current={entry?.name === item.name && !query ? 'page' : undefined}
                    >
                      <span>{item.name}</span>
                      <small>{item.label}</small>
                    </a>
                  ))}
                </div>
              )
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <span className="status-light" /> 精密线绘 · 持续演进
        </div>
      </aside>
      <main
        id="content"
        tabIndex={-1}
        className={entry && !query ? 'component-document' : 'overview-document'}
      >
        {entry && !query ? (
          <>
            <div className="document-main" key={entry.name}>
              <header className="component-header">
                <div className="doc-breadcrumb">
                  <a {...link('')}>组件</a>
                  <span>/</span>
                  {entry.group}
                </div>
                <h1 ref={title} tabIndex={-1}>
                  {entry.name}
                  <span>{entry.label}</span>
                </h1>
                <p>{entry.description}</p>
                <div className="component-meta">
                  <span className="component-tag">{entry.group}</span>
                  <span>{(detail?.examples ?? []).length} 个交互示例</span>
                  <span>实验性 Alpha</span>
                </div>
              </header>
              <div className="import-bar">
                <code>
                  {entry.group === '页面组合'
                    ? entry.importPath
                    : `import { ${entry.name} } from '${entry.importPath}';`}
                </code>
                {entry.group !== '页面组合' && (
                  <CopyButton
                    value={`import { ${entry.name} } from '${entry.importPath}';`}
                    label="复制导入"
                    aria-label="复制导入语句"
                    size="sm"
                    variant="ghost"
                  />
                )}
              </div>
              <section id={entry.name} className="preview-section">
                <div className="section-heading" id="examples">
                  <h2>代码演示</h2>
                  <span className="section-caption">即时体验 · 独立重置 · 复制源码</span>
                </div>
                {error ? (
                  <p role="alert">
                    资料加载失败。<button onClick={retry}>重新加载</button>
                  </p>
                ) : (
                  !detail && <p role="status">正在加载组件资料…</p>
                )}
                <div className="examples-grid" key={entry.name}>
                  {(detail?.examples ?? []).map((example) => (
                    <ExampleCard key={example.id} example={example} />
                  ))}
                </div>
              </section>
              <ApiTable entry={entry} signatures={detail?.api ?? []} />
              <section className="doc-section" id="guidelines">
                <h2>使用说明</h2>
                <p>
                  基础组件导入 <code>aig-ui/styles.css</code>。动效与 AI 组件分别补充导入对应入口的{' '}
                  <code>styles.css</code>。
                </p>
                {detail?.readme && (
                  <div className="readme">
                    <Suspense fallback={<p role="status">正在加载说明…</p>}>
                      <SafeMarkdown>{detail?.readme.replace(/^# .+\r?\n/, '')}</SafeMarkdown>
                    </Suspense>
                  </div>
                )}
                <Accordion.Root className="doc-accessibility">
                  <Accordion.Item value="accessibility">
                    <Accordion.Header>
                      <Accordion.Trigger>键盘、状态与接入约定</Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel>
                      <p>
                        交互控件保留 Tab 焦点、Enter / Space 激活与可见焦点环。图标操作通过 aria-label
                        提供名称，字段通过 Field 或 label 关联。
                      </p>
                      <p>
                        受控组件将 value 或 open 与对应的变化回调配合使用；defaultValue 和 defaultOpen
                        只设置初始状态。异步状态由实际任务驱动。
                      </p>
                      <p>
                        颜色通过 AigProvider 或 --aig- Token
                        设置。示例的业务数据可替换为应用数据，网络请求与持久化由接入应用负责。
                      </p>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion.Root>
              </section>
              <nav className="document-pagination" aria-label="相邻组件">
                {[-1, 1].map((offset) => {
                  const adjacent = entries[entries.indexOf(entry) + offset];
                  return adjacent ? (
                    <a key={offset} {...link(adjacent.name)}>
                      <small>
                        {offset === -1 ? (
                          <>
                            <Icon icon={ArrowLeft} size={14} /> 上一个组件
                          </>
                        ) : (
                          <>
                            下一个组件 <Icon icon={ArrowRight} size={14} />
                          </>
                        )}
                      </small>
                      <strong>
                        {adjacent.name} <span>{adjacent.label}</span>
                      </strong>
                    </a>
                  ) : (
                    <span key={offset} />
                  );
                })}
              </nav>
            </div>
            <nav className="page-toc" aria-label="本页目录">
              <span>本页内容</span>
              <a href="#examples">代码演示</a>
              {(detail?.examples ?? []).map((example) => (
                <a className="toc-example" key={example.id} href={`#example-${example.id}`}>
                  {example.title}
                </a>
              ))}
              <a href="#api">API 属性</a>
              <a href="#guidelines">使用说明</a>
              <div className="toc-note">
                线条随状态响应
                <br />
                内容保持清晰
              </div>
            </nav>
          </>
        ) : (
          <>
            <CatalogOverview
              search={search}
              category={category}
              visible={visible}
              titleRef={title}
              link={link}
              catalogId={catalogId}
              onCategoryChange={setCategory}
              onReset={() => {
                setSearch('');
                setCategory('全部');
                setSelected('');
                history.pushState(null, '', location.pathname);
                setSection('');
                setNavigation((value) => value + 1);
              }}
            />
          </>
        )}
        <footer className="site-footer">
          <span>
            aig ui <small>精密线绘 · 柔和科技</small>
          </span>
          <a href="https://ant.design/components/overview-cn/" target="_blank" rel="noreferrer">
            展示结构参考 Ant Design <Icon icon={ArrowUpRight} size={14} />
          </a>
        </footer>
      </main>
    </AigProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Preview />
  </StrictMode>,
);
