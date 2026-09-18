# Upload

选择或拖放文件，校验、上传、取消并重试。

## 基本用法

```tsx
import { Upload } from 'aig-ui';
import 'aig-ui/styles.css';

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
/>;
```

## 状态与边界

选择和拖放都校验 accept、maxSize、maxCount；校验只是客户端提示，服务端仍应验证文件。onUpload 接收 AbortSignal 和 onProgress，宿主接入真实网络请求；省略时只管理待上传文件。取消、移除和卸载都会中止当前请求。失败时保留文件并显示重试操作。本页示例使用 1.8 秒本地模拟，不发送网络请求。

通过 AigProvider 统一品牌和语义色。可见名称由 label 或 aria-label 提供，业务数据和持久化由宿主处理。
