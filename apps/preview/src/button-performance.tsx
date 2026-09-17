import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { AigProvider, Button } from 'aig-ui';
import '../../../packages/aig-ui/src/styles.css';
const count = Number(new URLSearchParams(location.search).get('count') ?? 50);
const started = performance.now();
flushSync(() =>
  createRoot(document.getElementById('root')!).render(
    <AigProvider>
      <div style={{ display: 'grid', gap: 12, width: 600 }}>
        {Array.from({ length: count }, (_, index) => (
          <Button entrance={false} key={index}>
            操作 {index}
          </Button>
        ))}
      </div>
    </AigProvider>,
  ),
);
document.body.dataset.mountMs = String(performance.now() - started);
