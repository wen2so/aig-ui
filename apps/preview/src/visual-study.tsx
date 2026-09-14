import { useEffect, useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { Button, Card, Dialog, Field, Icon, Input, Textarea } from 'aig-ui';
import { LoadingSequence } from 'aig-ui/motion';
import './visual-study.css';

/** 用真实表单、确认浮层和加载交接检查整页的视觉主次。 */
export function VisualStudy() {
  const [name, setName] = useState('设计工作空间');
  const [description, setDescription] = useState('集中整理资料，让团队专注于当前工作。');
  const [feedback, setFeedback] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [remove, setRemove] = useState(false);
  const [task, setTask] = useState(0);
  const [status, setStatus] = useState<'ready' | 'loading'>('ready');
  useEffect(() => {
    if (status !== 'loading') return;
    const timer = window.setTimeout(() => setStatus('ready'), 2400);
    return () => window.clearTimeout(timer);
  }, [status, task]);

  return (
    <div className="visual-study">
      <div className="visual-study-controls">
        <span>操作样板 · 本地演示</span>
        <Button
          variant="ghost"
          size="sm"
          disabled={status === 'loading'}
          leadingIcon={<Icon icon={RotateCcw} size={14} />}
          onClick={() => {
            setTask((value) => value + 1);
            setStatus('loading');
          }}
        >
          播放加载交接
        </Button>
      </div>
      <LoadingSequence taskId={`study-${task}`} status={status} label="AIG UI" description="正在准备工作空间">
        <div className="visual-study-workspace">
          <header className="visual-study-heading">
            <span>WORKSPACE / 01</span>
            <h2>让工作，从容开始。</h2>
            <p>保留清晰的目标，让每一次操作都有恰当的回应。</p>
          </header>
          <div className="visual-study-columns">
            <Card className="visual-study-form" material="solid">
              <h3>工作空间</h3>
              <p>设置名称和说明，方便团队识别。</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setConfirm(true);
                }}
              >
                <Field label="名称" required>
                  {(props) => (
                    <Input
                      {...props}
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        setFeedback('');
                      }}
                    />
                  )}
                </Field>
                <Field label="说明">
                  {(props) => (
                    <Textarea
                      {...props}
                      value={description}
                      onChange={(event) => {
                        setDescription(event.target.value);
                        setFeedback('');
                      }}
                    />
                  )}
                </Field>
                <div className="visual-study-actions">
                  <Button type="submit" trailingIcon={<Icon icon={ArrowRight} size={16} />}>
                    保存配置
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setName('设计工作空间');
                      setDescription('集中整理资料，让团队专注于当前工作。');
                      setFeedback('已恢复默认配置。');
                    }}
                  >
                    恢复默认
                  </Button>
                </div>
                <p className="visual-study-feedback" role="status">
                  {feedback || '\u00a0'}
                </p>
              </form>
            </Card>
            <aside className="visual-study-summary">
              <h3>当前配置</h3>
              <dl>
                <dt>工作空间</dt>
                <dd>{name || '待填写'}</dd>
                <dt>访问范围</dt>
                <dd>团队成员</dd>
                <dt>资料状态</dt>
                <dd>已就绪</dd>
              </dl>
              <p>保存后，团队将使用新的名称和说明。</p>
              <div className="visual-study-danger">
                <Button variant="ghost" tone="danger" size="sm" onClick={() => setRemove(true)}>
                  删除工作空间
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </LoadingSequence>
      <Dialog.Root open={confirm} onOpenChange={setConfirm}>
        <Dialog.Content>
          <Dialog.Title>保存工作空间配置</Dialog.Title>
          <Dialog.Description>将名称更新为「{name}」，并保存当前说明。</Dialog.Description>
          <Dialog.Actions>
            <Dialog.Close render={<Button variant="ghost" />}>继续编辑</Dialog.Close>
            <Button
              onClick={() => {
                setConfirm(false);
                setFeedback('配置已保存。');
              }}
            >
              确认保存
            </Button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog.Root>
      <Dialog.Root open={remove} onOpenChange={setRemove}>
        <Dialog.Content>
          <Dialog.Title>删除工作空间</Dialog.Title>
          <Dialog.Description>此处演示删除确认。确认后显示操作结果，表单内容保留。</Dialog.Description>
          <Dialog.Actions>
            <Dialog.Close render={<Button variant="ghost" />}>保留工作空间</Dialog.Close>
            <Button
              variant="danger"
              onClick={() => {
                setRemove(false);
                setFeedback('删除操作已演示。');
              }}
            >
              确认删除
            </Button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
