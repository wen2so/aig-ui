import ts from 'typescript';
import { resolve } from 'node:path';

/** 组合部件沿用基础控件语义，预览统一显示中文说明。 */
const descriptions = {
  value: '受控值，与 onValueChange 配合使用。',
  defaultValue: '非受控组件的初始值。',
  onValueChange: '值变化时调用，参数包含新值和事件信息。',
  open: '受控展开状态。',
  defaultOpen: '非受控组件的初始展开状态。',
  onOpenChange: '展开状态变化时调用。',
  onOpenChangeComplete: '展开或关闭过渡完成后调用。',
  disabled: '禁用操作，保留可读内容。',
  multiple: '允许同时选择或展开多个条目。',
  orientation: '排列与键盘导航方向。',
  loopFocus: '键盘焦点到达末端后循环移动。',
  keepMounted: '关闭后保留内容节点。',
  hiddenUntilFound: '允许浏览器页内查找展开隐藏内容。',
  render: '自定义渲染元素，保留组件传入的属性与 ref。',
  className: '附加样式类；组合部件可根据状态返回类名。',
  style: '内联样式与 CSS Token 覆盖。',
  children: '组件内容，可组合其他公开部件。',
  ref: '访问底层元素。',
  name: '表单字段名称。',
  required: '表单提交时要求填写。',
  modal: '启用模态焦点管理与背景交互隔离。',
  closeOnClick: '选择菜单项后关闭菜单。',
  closeDelay: '关闭前的延迟，单位毫秒。',
  delay: '打开前的延迟，单位毫秒。',
  side: '浮层相对触发器的位置。',
  align: '浮层相对触发器的对齐方式。',
  sideOffset: '浮层与触发器的间距，单位像素。',
  alignOffset: '沿对齐方向偏移，单位像素。',
  collisionPadding: '浮层与可视边界的最小间距。',
  container: 'Portal 挂载容器；默认继承 AigProvider。',
  initialFocus: '打开浮层后的初始焦点目标。',
  finalFocus: '关闭浮层后的返回焦点目标。',
  nativeButton: '渲染原生按钮时启用对应键盘语义。',
  activateOnFocus: '键盘聚焦标签时同步激活。',
  timeout: '提示自动关闭前的毫秒数；0 表示保持显示。',
  disableHoverablePopup: '启用后，指针移入提示内容时按关闭规则处理。',
  trackCursorAxis: '提示跟随鼠标移动的方向。',
  actionsRef: '访问组件提供的命令方法，可在宿主退出动画完成后卸载。',
  handle: '关联触发器和浮层的句柄。',
  triggerId: '与当前浮层关联的触发器标识。',
  defaultTriggerId: '初始关联的触发器标识。',
  payload: '打开浮层时向内容传入的数据。',
  limit: '同时展示的提示数量上限。',
  toastManager: '可在 React 组件外触发提示的管理器。',
  id: '元素标识，也用于关联触发器和浮层。',
  openOnHover: '鼠标悬停时展开。',
  highlightItemOnHover: '鼠标移入条目时同步高亮状态。',
  closeParentOnEsc: '在子菜单按 Escape 时同步关闭父菜单。',
  label: '可访问名称或显示标签，关联位置见组件示例。',
  onClick: '点击条目时调用。',
  disablePointerDismissal: '保持浮层打开，直到显式关闭。',
  type: '原生按钮或输入类型。',
  onChange: '原生字段变化事件。',
  checked: '受控勾选状态。',
  defaultChecked: '初始勾选状态。',
  placeholder: '空值时显示的输入提示。',
  readOnly: '保留选择与复制，按只读方式呈现。',
  min: '允许的最小值。',
  max: '允许的最大值。',
  step: '数值调整步长。',
  maxLength: '输入长度上限。',
  autoFocus: '挂载后请求初始焦点。',
  'aria-label': '提供可访问名称，图标操作需要设置。',
  'aria-describedby': '关联补充说明的元素标识。',
  'aria-invalid': '向辅助技术报告字段校验状态。',
  allowRemoteImages: '允许 Markdown 展示远程图片，默认关闭。',
  purpose: '工具执行目的。',
  status: '当前业务状态，决定状态文案与表现。',
  inputSummary: '输入内容摘要。',
  output: '工具输出内容。',
  error: '错误说明或恢复提示。',
  summary: '当前任务或操作摘要。',
  steps: '步骤名称列表。',
  actions: '操作区域，可传入按钮等 React 内容。',
  sources: '来源资料列表，字段见 Source。',
  onSubmit: '提交输入文本，可返回 Promise。',
  onStop: '请求停止当前任务。',
  running: '当前任务正在运行。',
  role: '消息作者身份。',
  content: '正文内容。',
  format: '正文渲染格式。',
  firstMessageId: '首条消息标识，用于保持加载历史消息时的阅读位置。',
  lastMessageId: '末条消息标识，用于跟随新增消息。',
  currentRevision: '目标当前版本，用于校验确认操作是否仍然有效。',
  target: '操作对象说明。',
  impact: '操作影响说明。',
  onConfirm: '确认后接收操作身份，可返回 Promise。',
  onReject: '拒绝操作后接收操作身份。',
  artifactId: '产物稳定标识。',
  revision: '本次操作或产物的版本。',
  title: '标题内容。',
  versions: '可切换的产物版本列表。',
  onSave: '保存产物变更，可返回 Promise。',
  onApply: '应用产物变更。',
  as: '底层语义元素。',
  size: '组件尺寸，默认值见当前签名。',
  tone: '内容的语义色调。',
  onCheckedChange: '勾选状态变化后接收布尔值。',
  busy: '展示正在运行的状态。',
  decorative: '将分隔线作为装饰，从辅助技术中隐藏。',
  options: '可选择条目，字段见 SelectOption。',
  description: '补充说明内容。',
  scroll: '在面板内容区启用滚动。',
  material: '容器采用玻璃或实色材质。',
  page: '当前页码，从 1 开始。',
  pageCount: '总页数。',
  onPageChange: '切换后接收新的页码。',
  current: '标记当前导航项。',
  icon: '自定义图标内容。',
  level: '语义标题层级，对应 h1 至 h6。',
  items: '展示条目列表，数据结构见相关类型。',
  columns: '列布局或列定义，结构见属性类型。',
  onCopySuccess: '复制成功后调用。',
  onCopyError: '复制失败后接收错误对象。',
  indeterminate: '复选框的部分选中状态。',
  scope: '表头关联方向，列标题默认 col。',
  colSpan: '单元格跨列数量。',
  rowSpan: '单元格跨行数量。',
};

/** 从当前源码读取公开属性，供组件资料和预览文档共用。 */
export function createApiReader(root = process.cwd()) {
  const source = resolve(root, 'packages/aig-ui/src');
  const slash = (path) => path.replaceAll('\\', '/');
  const config = ts.readConfigFile(resolve(root, 'tsconfig.json'), ts.sys.readFile).config;
  const parsed = ts.parseJsonConfigFileContent(config, ts.sys, root);
  const program = ts.createProgram(parsed.fileNames, parsed.options);
  const checker = program.getTypeChecker();
  const nativeProps = new Set([
    'children',
    'className',
    'style',
    'ref',
    'id',
    'type',
    'disabled',
    'onClick',
    'name',
    'value',
    'checked',
    'placeholder',
    'readOnly',
    'required',
    'min',
    'max',
    'step',
    'maxLength',
    'aria-label',
    'aria-describedby',
    'scope',
    'colSpan',
    'rowSpan',
  ]);
  /** 收录本库、基础交互属性及常用原生属性，排除内部字段。 */
  function readProps(type, node, defaults = new Map(), item = false, fields = false) {
    return (
      type
        ?.getProperties()
        .filter(
          (prop) =>
            !prop.name.startsWith('_') &&
            (nativeProps.has(prop.name) ||
              (fields &&
                ['onChange', 'defaultValue', 'defaultChecked', 'autoFocus', 'aria-invalid'].includes(
                  prop.name,
                )) ||
              prop.declarations?.some((declaration) => {
                const file = slash(declaration.getSourceFile().fileName);
                return file.startsWith(slash(source) + '/') || file.includes('/@base-ui/react/');
              })),
        )
        .map((prop) => {
          const text = ts.displayPartsToString(prop.getDocumentationComment(checker));
          const valueDescription =
            prop.name === 'value' && !type.getProperty('onValueChange')
              ? type.getProperty('onChange')
                ? '原生元素的值，表单输入通过 onChange 接收更新。'
                : '条目的值或唯一标识。'
              : undefined;
          return {
            name: prop.name,
            required: !(prop.flags & ts.SymbolFlags.Optional),
            type: checker.typeToString(
              checker.getTypeOfSymbolAtLocation(prop, node),
              node,
              ts.TypeFormatFlags.NoTruncation,
            ),
            description:
              item && prop.name === 'value'
                ? '当前条目的稳定标识，与容器的选中值对应。'
                : /[\u4e00-\u9fff]/.test(text)
                  ? text
                  : (valueDescription ?? descriptions[prop.name] ?? text),
            defaultValue:
              defaults.get(prop.name) ??
              (ts.displayPartsToString(
                prop
                  .getJsDocTags(checker)
                  .find((tag) => tag.name === 'default' || tag.name === 'defaultValue')?.text,
              ) ||
                '—'),
          };
        }) ?? []
    );
  }
  /** 调用签名、组合部件与同文件公开数据类型共同构成完整参考。 */
  function apiFor(file, name) {
    const node = program.getSourceFile(file);
    const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(node));
    const symbol = exports.find((item) => item.name === name);
    if (!symbol) throw Error('公共组件未导出：' + name);
    const type = checker.getTypeOfSymbolAtLocation(symbol, node);
    const parts = [
      { name, type },
      ...type
        .getProperties()
        .map((part) => ({ name: part.name, type: checker.getTypeOfSymbolAtLocation(part, node) })),
    ];
    const signatures = parts.flatMap((part) =>
      part.type.getCallSignatures().map((signature) => {
        const defaults = new Map();
        const binding = signature.getDeclaration()?.parameters?.[0]?.name;
        if (binding && ts.isObjectBindingPattern(binding)) {
          for (const element of binding.elements)
            if (element.initializer) defaults.set(element.name.getText(), element.initializer.getText());
        }
        const parameter = signature.getParameters()[0];
        const parameterType = parameter && checker.getTypeOfSymbolAtLocation(parameter, node);
        return {
          part: part.name,
          propsType: parameterType
            ? checker.typeToString(parameterType, node, ts.TypeFormatFlags.NoTruncation)
            : 'void',
          props: readProps(
            parameterType,
            node,
            defaults,
            part.name === 'Item',
            ['Input', 'Textarea', 'Checkbox', 'Switch', 'RadioGroup', 'Select', 'Combobox'].includes(name),
          ),
        };
      }),
    );
    const relatedTypes = exports
      .filter(
        (part) =>
          part.flags & (ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias) && !part.name.endsWith('Props'),
      )
      .flatMap((part) => {
        const type = checker.getDeclaredTypeOfSymbol(part);
        const props = readProps(type, node);
        return props.length
          ? [{ part: part.name, kind: 'type', propsType: checker.typeToString(type), props }]
          : [];
      });
    return [...signatures, ...relatedTypes];
  }
  return apiFor;
}
