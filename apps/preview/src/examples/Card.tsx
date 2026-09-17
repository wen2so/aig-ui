import { Card, Badge, Button, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'materials',
    title: '材质与内容层级',
    description: '玻璃表面承载概览，实色表面适合长时间阅读。',
    render: () => (
      <div className="example-pair">
        <Card material="glass">
          <small>DESIGN NOTES</small>
          <h3>一束光，一条线。</h3>
          <p>柔和环境中的轻盈表面。</p>
          <Badge tone="info">持续演进</Badge>
        </Card>
        <Card material="solid">
          <small>READING ROOM</small>
          <h3>给内容留白。</h3>
          <p>清楚的层次，专注的阅读。</p>
          <Button variant="ghost">阅读记录</Button>
        </Card>
      </div>
    ),
    code: '<Card material="glass">柔和玻璃</Card>\n<Card material="solid">阅读表面</Card>',
    wide: true,
  },
];
export default examples;
