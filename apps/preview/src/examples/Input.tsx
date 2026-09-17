import { Field, Input, ValidationDemo, type Example } from '../example-helpers.js';
const examples: Example[] = [
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
];
export default examples;
