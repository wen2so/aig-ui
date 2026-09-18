import { useState } from 'react';
import { Icon, CopyButton } from 'aig-ui';
import { Code, RotateCcw } from 'lucide-react';
import type { Example } from './examples.js';
import type { Entry } from './catalog-model.js';
import type { ApiSignature } from '../../../scripts/component-api.mjs';
/** 示例保留独立状态，重置后从初始状态重新演示。 */
export function ExampleCard({ example }: { example: Example }) {
  const [run, setRun] = useState(0);
  const [codeOpen, setCodeOpen] = useState(false);
  return (
    <article className="example-card" data-wide={example.wide || undefined} id={`example-${example.id}`}>
      <div className="example-caption">
        <h3>{example.title}</h3>
        <p>{example.description}</p>
      </div>
      <div className="preview-example" key={run}>
        {example.render()}
      </div>
      <div className="example-toolbar">
        <span>可交互示例</span>
        <button onClick={() => setRun(run + 1)} aria-label={`重置${example.title}`}>
          <Icon icon={RotateCcw} size={14} /> <span>重置</span>
        </button>
        <CopyButton
          value={example.code}
          label="复制代码"
          aria-label={`复制${example.title}代码`}
          variant="ghost"
        />
        <button
          aria-expanded={codeOpen}
          aria-controls={`code-${example.id}`}
          onClick={() => setCodeOpen(!codeOpen)}
          aria-label={`查看${example.title}代码`}
        >
          <Icon icon={Code} size={16} />
        </button>
      </div>
      <div
        className="code-disclosure"
        data-open={codeOpen || undefined}
        inert={!codeOpen}
        aria-hidden={!codeOpen}
      >
        <pre className="example-code" id={`code-${example.id}`}>
          <code>{example.code}</code>
        </pre>
      </div>
    </article>
  );
}

/** 属性表来自当前源码声明，主题作用域与其他组件共用同一套资料。 */
export function ApiTable({
  entry,
  signatures,
}: {
  entry: Pick<Entry, 'name' | 'group'>;
  signatures: ApiSignature[];
}) {
  return (
    <section className="doc-section" id="api">
      <h2>
        API <span>属性参考</span>
      </h2>
      <p>属性来自当前组件声明，包含组合部件、相关数据类型与常用原生属性。</p>
      {signatures.map((signature, i) => (
        <div key={`${signature.part}-${i}`}>
          <h3>
            {signature.kind === 'type'
              ? `数据类型 ${signature.part}`
              : signature.part === entry.name
                ? entry.name
                : `${entry.name}.${signature.part}`}
          </h3>
          {signature.props.length ? (
            <div className="api-scroll" tabIndex={0} role="region" aria-label={`${signature.part} 属性表`}>
              <table>
                <thead>
                  <tr>
                    <th>属性</th>
                    <th>说明</th>
                    <th>类型</th>
                    <th>默认值</th>
                    <th>必填</th>
                  </tr>
                </thead>
                <tbody>
                  {signature.props.map((prop) => (
                    <tr key={prop.name}>
                      <td>
                        <code>{prop.name}</code>
                      </td>
                      <td>{prop.description || '见完整组件说明'}</td>
                      <td>
                        <code>{prop.type}</code>
                      </td>
                      <td>
                        <code>{prop.defaultValue}</code>
                      </td>
                      <td>{prop.required ? '是' : '可选'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>
              继承原生控件属性，可使用 <code>{signature.propsType}</code> 查看完整类型。
            </p>
          )}
        </div>
      ))}
      {entry.group === '页面组合' && (
        <p>页面组合通过 Registry 提供源码，业务数据和操作由接入应用提供。完整演示代码可在示例中展开。</p>
      )}
    </section>
  );
}
