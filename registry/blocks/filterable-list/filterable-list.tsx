'use client';

import { useState } from 'react';
import {
  AigProvider,
  PageHeader,
  Field,
  Input,
  Button,
  Table,
  Pagination,
  Drawer,
  DescriptionList,
  EmptyState,
  Alert,
  Skeleton,
  Badge,
} from 'aig-ui';

export interface ListItem {
  id: string;
  name: string;
  status: string;
  description: string;
}
/** 查询、排序和分页由宿主映射到真实请求。 */
export interface FilterableListProps {
  items: ListItem[];
  query: string;
  page: number;
  pageCount: number;
  status: 'loading' | 'ready' | 'error';
  onQueryChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

/** 显示列表的加载、空态、失败与详情。 */
export function FilterableList({
  items,
  query,
  page,
  pageCount,
  status,
  onQueryChange,
  onPageChange,
  onRetry,
}: FilterableListProps) {
  const [selected, setSelected] = useState<ListItem | null>(null);
  return (
    <AigProvider>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
        <PageHeader title="项目资料" description="筛选资料并查看处理状态。" />
        <div style={{ marginBottom: 24 }}>
          <Field label="查找资料">
            {(props) => (
              <Input
                {...props}
                type="search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="输入资料名称"
              />
            )}
          </Field>
        </div>
        {status === 'loading' ? (
          <div aria-busy="true">
            <p role="status">正在加载资料</p>
            <Skeleton style={{ height: 180 }} />
          </div>
        ) : status === 'error' ? (
          <Alert tone="danger" title="资料读取未完成">
            <p>请重试当前查询。</p>
            <Button onClick={onRetry}>重试读取</Button>
          </Alert>
        ) : items.length === 0 ? (
          <EmptyState
            title={query ? '暂无匹配资料' : '暂无项目资料'}
            description={query ? '调整筛选条件后查看结果。' : '添加第一份资料后开始处理。'}
            actions={
              query ? (
                <Button variant="outline" onClick={() => onQueryChange('')}>
                  清除筛选
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <Table>
              <Table.Caption>项目资料列表</Table.Caption>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>资料名称</Table.HeaderCell>
                  <Table.HeaderCell>状态</Table.HeaderCell>
                  <Table.HeaderCell>操作</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {items.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>
                      <Badge>{item.status}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelected(item)}
                        aria-label={`查看${item.name}`}
                      >
                        查看详情
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <div style={{ marginTop: 24 }}>
              <Pagination page={page} pageCount={pageCount} onPageChange={onPageChange} />
            </div>
          </>
        )}
        <Drawer.Root
          open={selected !== null}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
        >
          <Drawer.Content>
            <Drawer.Title>资料详情</Drawer.Title>
            <Drawer.Description>{selected?.name}</Drawer.Description>
            {selected && (
              <DescriptionList
                items={[
                  { id: 'id', label: '资料标识', value: selected.id },
                  { id: 'status', label: '当前状态', value: selected.status },
                  { id: 'description', label: '说明', value: selected.description },
                ]}
              />
            )}
            <Drawer.Actions>
              <Drawer.Close render={<Button />}>关闭详情</Drawer.Close>
            </Drawer.Actions>
          </Drawer.Content>
        </Drawer.Root>
      </div>
    </AigProvider>
  );
}
