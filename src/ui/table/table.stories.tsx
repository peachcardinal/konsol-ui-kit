import React from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import type { TableProps as UiTableProps } from './table'
import type { TableColumn, TableRecord } from './table-types'

import { Button } from '../button'
import { Typography } from '../typography'
import { Table } from './table'

type Status = 'active' | 'inactive' | 'pending'

type DemoRecord = TableRecord & {
  id: number
  name: string
  age: number
  category: { title: string }
  status: Status
}

const DATA: DemoRecord[] = [
  { id: 1, name: 'Alice', age: 30, category: { title: 'A' }, status: 'active' },
  { id: 2, name: 'Bob', age: 24, category: { title: 'B' }, status: 'inactive' },
  { id: 3, name: 'Charlie', age: 35, category: { title: 'A' }, status: 'pending' },
  { id: 4, name: 'David', age: 28, category: { title: 'C' }, status: 'active' },
  { id: 5, name: 'Eve', age: 29, category: { title: 'B' }, status: 'inactive' },
]

const COLUMNS: TableColumn<DemoRecord>[] = [
  { key: 'id', dataIndex: 'id', title: 'ID', width: 80, fixed: 'left', sorter: true },
  { key: 'name', dataIndex: 'name', title: 'Имя', minWidth: 200, sorter: true },
  { key: 'age', dataIndex: 'age', title: 'Возраст', width: 120, align: 'center', sorter: true },
  { key: 'category', dataIndex: 'category.title', title: 'Категория', minWidth: 180 },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Статус',
    width: 140,
    fixed: 'right',
    render: value => (
      <Typography as="span" variant="p2">
        {String(value).toUpperCase()}
      </Typography>
    ),
  },
]

function DemoTable(props: UiTableProps<DemoRecord>) {
  return <Table<DemoRecord> {...props} />
}

const meta = {
  title: 'UI/Table',
  component: DemoTable,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  render: args => (
    <div className="p-4">
      <DemoTable {...args} />
    </div>
  ),
} satisfies Meta<typeof DemoTable>

export default meta
type Story = StoryObj<typeof meta>

const BASE_ARGS: UiTableProps<DemoRecord> = {
  dataSource: DATA,
  columns: COLUMNS,
  rowKey: 'id',
}

export const Basic: Story = {
  args: {
    ...BASE_ARGS,
    onRow: record => ({
      onClick: () => console.log('row click', record.id),
      'data-testid': `row-${record.id}`,
    }),
  },
}

export const Loading: Story = {
  args: {
    ...BASE_ARGS,
    loading: true,
    loadingRows: 8,
    scroll: { x: 'max-content', y: 280 },
    stickyHeader: true,
  },
}

export const FixedAndSticky: Story = {
  args: {
    ...BASE_ARGS,
    dataSource: Array.from({ length: 40 }).map((_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      age: 18 + ((i * 7) % 40),
      category: { title: ['A', 'B', 'C'][i % 3] },
      status: (['active', 'inactive', 'pending'] as const)[i % 3],
    })),
    scroll: { x: 'max-content', y: 360 },
    stickyHeader: true,
    onRow: record => ({
      onClick: () => console.log('navigate to', record.id),
      'aria-label': `Открыть строку ${record.id}`,
    }),
  },
}

export const RowSelection: Story = {
  render: (args) => {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([])
    const [selectAllMode, setSelectAllMode] = React.useState<'page' | 'all'>('page')

    const allRowKeys = (args.dataSource ?? []).map(r => (r as DemoRecord).id)

    return (
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <Button
            type="button"
            variant="default"
            size="md"
            onClick={() => setSelectAllMode(m => (m === 'page' ? 'all' : 'page'))}
          >
            <span>Режим чекбокса:</span>
            <span className="ml-1">
              {selectAllMode === 'page' ? 'страница' : 'все записи'}
            </span>
          </Button>
          <Typography variant="p2" textColor="secondary">
            В заголовке один чекбокс, поведение переключается атрибутом `selectAllMode`
          </Typography>
        </div>

        <DemoTable
          {...args}
          rowSelection={{
            selectedRowKeys,
            onChange: keys => setSelectedRowKeys(keys),
            selectAllMode,
            allRowKeys,
          }}
        />
        <div className="mt-3">
          <Typography variant="p2" textColor="secondary">
            <span>Выбрано ключей:</span>
            <span className="ml-1">
              {selectedRowKeys.length}
            </span>
          </Typography>
        </div>
      </div>
    )
  },
  args: {
    ...BASE_ARGS,
    scroll: { x: 'max-content' },
  },
}

export const NewRowAppearance: Story = {
  render: (args) => {
    const [dataSource, setDataSource] = React.useState<DemoRecord[]>(() => (args.dataSource ?? []) as DemoRecord[])

    const handleAddRow = () => {
      const maxId = dataSource.reduce((acc, r) => Math.max(acc, r.id), 0)
      const nextId = maxId + 1
      const next: DemoRecord = {
        id: nextId,
        name: `New user ${nextId}`,
        age: 18 + (nextId % 40),
        category: { title: ['A', 'B', 'C'][nextId % 3] },
        status: (['active', 'inactive', 'pending'] as const)[nextId % 3],
      }
      setDataSource([next, ...dataSource])
    }

    return (
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <Button type="button" variant="primary" size="md" onClick={handleAddRow}>
            Добавить запись
          </Button>
          <Typography variant="p2" textColor="secondary">
            Новая строка сверху подсветится и плавно исчезнет
          </Typography>
        </div>

        <DemoTable
          {...args}
          highlightNewRows
          dataSource={dataSource}
          scroll={{ x: 'max-content', y: 280 }}
          stickyHeader
        />
      </div>
    )
  },
  args: {
    ...BASE_ARGS,
  },
}

export const EmptyStateDefault: Story = {
  args: {
    ...BASE_ARGS,
    dataSource: [],
  },
}

export const EmptyStateCustomTexts: Story = {
  args: {
    ...BASE_ARGS,
    dataSource: [],
    locale: {
      emptyTitle: 'Пока пусто',
      emptyDescription: 'Создайте первую запись, чтобы увидеть таблицу',
    },
  },
}
