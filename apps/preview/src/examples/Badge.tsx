import { tones, Badge, toneLabels, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'tones',
    title: '状态语义',
    description: '紧凑胶囊轮廓配合文字与状态色。',
    render: () => (
      <div className="preview-actions">
        {tones.map((tone, i) => (
          <Badge key={tone} tone={tone}>
            {toneLabels[i]}
          </Badge>
        ))}
      </div>
    ),
    code: tones.map((tone, i) => `<Badge tone="${tone}">${toneLabels[i]}</Badge>`).join('\n'),
  },
];
export default examples;
