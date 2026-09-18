import { act, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { Upload, type UploadContext } from './upload.js';

test('选择和取消上传遵守校验，移除后忽略迟到的完成与进度', async () => {
  const user = userEvent.setup();
  let context: UploadContext | undefined;
  let finish: (() => void) | undefined;
  const upload = vi.fn((_file: File, ctx: UploadContext) => {
    context = ctx;
    return new Promise<void>((resolve) => {
      finish = resolve;
    });
  });
  const change = vi.fn();
  render(<Upload accept=".txt" maxSize={4} onUpload={upload} onFilesChange={change} />);
  const input = screen.getByLabelText('选择或拖入文件');
  fireEvent.change(input, { target: { files: [new File(['x'], 'bad.pdf', { type: 'application/pdf' })] } });
  expect(upload).not.toHaveBeenCalled();
  expect(screen.getByRole('alert')).toHaveTextContent('文件类型不符合要求');
  fireEvent.change(input, { target: { files: [new File(['abc'], 'ok.txt', { type: 'text/plain' })] } });
  expect(upload).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole('button', { name: '移除ok.txt' }));
  expect(context!.signal.aborted).toBe(true);
  await act(async () => {
    context!.onProgress(90);
    finish!();
  });
  expect(screen.queryByText('ok.txt')).not.toBeInTheDocument();
  expect(change).toHaveBeenLastCalledWith([]);
});
