import { it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ArtifactPreview } from './artifact-preview.js';
it('保存失败保留编辑内容，历史版本禁用应用', async () => {
  const save = vi.fn().mockRejectedValue(Error('保存失败'));
  render(
    <ArtifactPreview
      artifactId="doc"
      title="结果"
      versions={[
        { revision: '1', content: '旧文' },
        { revision: '2', content: '原文' },
      ]}
      onSave={save}
      onApply={() => {}}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: '编辑内容' }));
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '编辑后的草稿' } });
  fireEvent.click(screen.getByRole('button', { name: '保存修改' }));
  await screen.findByText('保存失败');
  expect(screen.getByRole('textbox')).toHaveValue('编辑后的草稿');
  fireEvent.click(screen.getByRole('button', { name: '取消编辑' }));
  fireEvent.change(screen.getByLabelText('产物版本'), { target: { value: '1' } });
  expect(screen.getByRole('button', { name: '审核并应用' })).toBeDisabled();
});
it('外部新修订保留正在编辑的草稿并阻止旧版保存', () => {
  const versions = [{ revision: '1', content: '原文' }];
  const save = vi.fn();
  const view = render(<ArtifactPreview artifactId="doc" title="结果" versions={versions} onSave={save} />);
  fireEvent.click(screen.getByRole('button', { name: '编辑内容' }));
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '未保存草稿' } });
  view.rerender(
    <ArtifactPreview
      artifactId="doc"
      title="结果"
      versions={[...versions, { revision: '2', content: '外部更新' }]}
      onSave={save}
    />,
  );
  expect(screen.getByRole('textbox')).toHaveValue('未保存草稿');
  expect(screen.getByRole('button', { name: '保存修改' })).toBeDisabled();
  expect(save).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: '取消编辑' }));
  expect(screen.getByText('外部更新')).toBeVisible();
});

it.each(['resolve', 'reject'])('切换产物后忽略旧保存的 %s 结果', async (outcome) => {
  let resolve!: () => void;
  let reject!: (reason: Error) => void;
  const save = () =>
    new Promise<void>((yes, no) => {
      resolve = yes;
      reject = no;
    });
  const versions = [{ revision: '1', content: '正文' }];
  const view = render(<ArtifactPreview artifactId="a" title="A" versions={versions} onSave={save} />);
  fireEvent.click(screen.getByRole('button', { name: '编辑内容' }));
  fireEvent.click(screen.getByRole('button', { name: '保存修改' }));
  view.rerender(<ArtifactPreview artifactId="b" title="B" versions={versions} onSave={save} />);
  expect(screen.queryByRole('textbox')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: '编辑内容' }));
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'B 草稿' } });
  await act(async () => {
    if (outcome === 'resolve') resolve();
    else reject(Error('A 保存失败'));
  });
  expect(screen.getByRole('textbox')).toHaveValue('B 草稿');
  expect(screen.queryByRole('alert')).toBeNull();
});
