import { useState, type ComponentProps, type Ref } from 'react';
import { ArrowUpRight, Grid2X2, List } from 'lucide-react';
import { Button, Icon } from 'aig-ui';
import { entries, groups, type Entry } from './catalog-model.js';

interface CatalogOverviewProps {
  search: string;
  category: string;
  visible: Entry[];
  onCategoryChange: (value: string) => void;
  onReset: () => void;
  titleRef: Ref<HTMLHeadingElement>;
  link: (name: string, anchor?: string) => ComponentProps<'a'>;
  catalogId: (group: string) => string;
}

/** 目录使用轻量静态几何说明用途，真实控件和动效只在详情按需加载。 */
function CatalogGlyph({ group }: { group: string }) {
  return (
    <svg viewBox="0 0 180 74" fill="none" stroke="currentColor" aria-hidden="true">
      {group === '数据展示' || group === '布局' || group === '页面组合' ? (
        <>
          <rect x="18" y="12" width="144" height="50" opacity=".5" />
          <path d="M18 28H162M60 28V62M108 28V62M18 45H162" opacity=".25" />
          <path d="M18 20V12H36M144 62H162V54" />
        </>
      ) : group === '数据录入' ? (
        <>
          <path d="M18 17H75M18 28H162V61H18Z" opacity=".45" />
          <path d="M29 44H113M124 37V51" />
          <path d="M29 60H82" strokeWidth="2" />
        </>
      ) : group === '动效' || group === 'AI' || group === '主题' ? (
        <>
          <path d="M90 10 119 61H61ZM74 46H106" />
          <circle cx="90" cy="37" r="32" strokeDasharray="56 20" opacity=".3" />
          <path d="M18 37H47M133 37H162" opacity=".3" />
        </>
      ) : (
        <>
          <path d="M18 24H162V54H18Z" opacity=".35" />
          <path d="M34 32 40 39 34 46Z" />
          <path d="M57 38H116M146 24H162V38" />
          <path d="M118 54 135 24" opacity=".25" />
        </>
      )}
    </svg>
  );
}

/** 总览负责发现和筛选，页面状态与地址导航由主工作台管理。 */
export function CatalogOverview({
  search,
  category,
  visible,
  onCategoryChange,
  onReset,
  titleRef,
  link,
  catalogId,
}: CatalogOverviewProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const query = search.trim();
  const components = entries.filter((entry) => !['页面组合', '主题'].includes(entry.group));
  return (
    <>
      <header className="overview-header">
        <svg className="overview-orbit" viewBox="0 0 320 320" fill="none" aria-hidden="true">
          <circle cx="160" cy="160" r="145" strokeDasharray="1 9" />
          <circle cx="160" cy="160" r="126" strokeDasharray="190 24 50 24" />
          <circle cx="160" cy="160" r="104" />
          <path d="M160 4V52M160 268V316M4 160H52M268 160H316M82 238 160 82 238 238ZM116 204H204" />
          <path d="M60 60 260 260M60 260 260 60" strokeDasharray="3 8" />
          <circle cx="160" cy="34" r="4" fill="currentColor" />
        </svg>
        <div>
          <div className="preview-eyebrow">AIG UI / COMPONENT WORKSPACE</div>
          <h1 ref={titleRef} tabIndex={-1}>
            {query ? '搜索结果' : '组件工作台'}
          </h1>
          <p>
            {query
              ? `找到 ${visible.length} 项与「${query}」相关的组件与页面。`
              : '选择控件，组合界面。统一外观、交互和状态，在实际示例中验证用法。'}
          </p>
        </div>
        <div className="catalog-metrics">
          <div>
            <strong>{components.length}</strong>
            <span>可用组件</span>
          </div>
          <div>
            <strong>{entries.filter((entry) => entry.group === '页面组合').length}</strong>
            <span>页面组合</span>
          </div>
          <div>
            <strong>01</strong>
            <span>主题入口</span>
          </div>
        </div>
      </header>
      {!query && (
        <div className="featured-links">
          {[
            ['Button', '01 / 设计语言', '按钮与交互', '查看外观、颜色和状态'],
            ['visual-study', '02 / 页面组合', '完整操作样板', '体验编辑、保存与确认'],
            ['ai-assistant', '03 / AI', '对话与任务', '查看消息、来源与产物'],
          ].map(([name, index, title, description]) => (
            <a key={name} {...link(name!)}>
              <span>{index}</span>
              <strong>{title}</strong>
              <small>
                {description}
                <Icon icon={ArrowUpRight} size={14} />
              </small>
            </a>
          ))}
        </div>
      )}
      <div className="catalog-toolbar" id="catalog-filter">
        <div className="category-filter" aria-label="按用途筛选">
          {['全部', ...groups.map((group) => group.label)].map((label) => (
            <button key={label} aria-pressed={category === label} onClick={() => onCategoryChange(label)}>
              {label}
            </button>
          ))}
        </div>
        <div className="catalog-view" role="group" aria-label="目录显示方式">
          <button aria-label="网格视图" aria-pressed={view === 'grid'} onClick={() => setView('grid')}>
            <Icon icon={Grid2X2} size={16} />
          </button>
          <button aria-label="列表视图" aria-pressed={view === 'list'} onClick={() => setView('list')}>
            <Icon icon={List} size={16} />
          </button>
        </div>
      </div>
      {groups
        .filter((group) => visible.some((entry) => entry.group === group.label))
        .map((group, index) => (
          <section
            className="catalog-group"
            key={group.label}
            id={catalogId(group.label)}
            tabIndex={-1}
            aria-labelledby={`${catalogId(group.label)}-heading`}
          >
            <div className="catalog-group-heading">
              <h2 id={`${catalogId(group.label)}-heading`}>
                <small>{String(index + 1).padStart(2, '0')}</small>
                {group.label}
                <span>{visible.filter((entry) => entry.group === group.label).length}</span>
              </h2>
              <p>{group.caption}</p>
            </div>
            <div className="catalog-grid" data-view={view}>
              {visible
                .filter((entry) => entry.group === group.label)
                .map((entry) => (
                  <article className="catalog-card" key={entry.name}>
                    <div className="catalog-art" data-group={entry.group}>
                      <div className="catalog-miniature" data-ambient="paused" inert aria-hidden="true">
                        <CatalogGlyph group={entry.group} />
                      </div>
                    </div>
                    <a
                      className="catalog-card-caption"
                      {...link(entry.name)}
                      aria-label={`${entry.label} ${entry.name}`}
                    >
                      <div className="catalog-card-title">
                        <h3>
                          {entry.label}
                          <span>{entry.name}</span>
                        </h3>
                        <Icon icon={ArrowUpRight} size={15} />
                      </div>
                      <p>{entry.description}</p>
                    </a>
                  </article>
                ))}
            </div>
          </section>
        ))}
      {!visible.length && (
        <div className="search-empty">
          <h2>当前没有匹配的组件</h2>
          <p>尝试组件名称或用途，例如“按钮”“日期”或“上传”。</p>
          <Button onClick={onReset}>查看全部组件</Button>
        </div>
      )}
    </>
  );
}
