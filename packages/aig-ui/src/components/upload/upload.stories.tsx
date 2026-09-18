import { Upload } from './upload.js';
export default { title: '数据录入/Upload', component: Upload };
export const preview = {
  name: 'Upload',
  label: '上传',
  description: '选择或拖放文件，校验、上传、取消并重试。',
};
/** 用真实控件展示上传的输入和选择。 */
export function Preview() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <p>本地模拟上传，可取消和重试，不发送网络请求。</p>
      <Upload
        multiple
        accept=".txt,.pdf,image/*"
        maxSize={5 * 1024 * 1024}
        maxCount={5}
        onUpload={async (_file, { signal, onProgress }) => {
          onProgress(30);
          await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(resolve, 1800);
            signal.addEventListener(
              'abort',
              () => {
                clearTimeout(timer);
                reject(new Error('上传已取消'));
              },
              { once: true },
            );
          });
          onProgress(100);
        }}
      />
    </div>
  );
}
