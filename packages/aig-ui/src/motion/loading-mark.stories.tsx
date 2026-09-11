import { useState } from 'react';
import { LoadingMark } from './loading-mark.js';
import { Button } from '../components/button/button.js';
import './styles.css';

export default { title: '动效/LoadingMark', component: LoadingMark };
export function Playback() {
  const [phase, setPhase] = useState<'drawing' | 'holding' | 'erasing' | 'static'>('drawing');
  const [run, setRun] = useState(0);
  return (
    <div data-aig-theme="warm">
      <LoadingMark key={run} phase={phase} label="正在加载" />
      <div>
        {(['drawing', 'holding', 'erasing', 'static'] as const).map((value) => (
          <Button key={value} onClick={() => setPhase(value)}>
            {value}
          </Button>
        ))}
        <Button
          onClick={() => {
            setRun(run + 1);
            setPhase('drawing');
          }}
        >
          重放
        </Button>
      </div>
    </div>
  );
}
export const Sizes = () => (
  <div>
    {[64, 96, 128].map((size) => (
      <LoadingMark key={size} phase="static" size={size} label={`${size} 像素标记`} />
    ))}
  </div>
);
