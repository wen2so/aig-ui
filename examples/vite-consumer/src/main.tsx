import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from 'aig-ui/button';
import 'aig-ui/styles.css';

function App() {
  const [saved, setSaved] = useState(false);
  return <main data-aig-theme="warm" style={{ padding: 24 }}><h1>aig-ui 消费验证</h1><Button onClick={() => setSaved(true)}>保存设置</Button><p role="status">{saved ? '设置已保存' : '等待操作'}</p></main>;
}
createRoot(document.getElementById('root')!).render(<App />);
