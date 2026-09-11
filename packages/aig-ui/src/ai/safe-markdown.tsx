import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** 仅接受可导航的网页、邮件及站内地址，拒绝可执行协议。 */
export function safeUrl(value: string) {
  try {
    const url = new URL(value, 'https://aig-ui.invalid');
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? value : undefined;
  } catch { return undefined; }
}

/** 以安全 Markdown 渲染文本；远程图片由宿主显式启用。 */
export function SafeMarkdown({children,allowRemoteImages=false}:{children:string;allowRemoteImages?:boolean}) {
  return <Markdown skipHtml remarkPlugins={[remarkGfm]} urlTransform={safeUrl} components={{
    a: ({href,children}) => href ? <a href={href} target="_blank" rel="noopener noreferrer">{children}</a> : <span>{children}</span>,
    img: ({src,alt}) => allowRemoteImages && src ? <img src={src} alt={alt ?? ''} loading="lazy" /> : null,
  }}>{children}</Markdown>;
}
