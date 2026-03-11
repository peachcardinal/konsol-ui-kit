import React from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import type { TableCardsProps } from './table-cards'
import type { TableRecord } from './table-types'

import { Typography } from '../typography'
import { TableCards } from './table-cards'

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

function DemoTableCards(props: TableCardsProps<DemoRecord>) {
  return <TableCards<DemoRecord> {...props} />
}

const meta = {
  title: 'UI/Table (Mobile Cards)',
  component: DemoTableCards,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  render: args => (
    <div className="p-4">
      <DemoTableCards {...args} />
    </div>
  ),
} satisfies Meta<typeof DemoTableCards>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    items: DATA,
    getCardKey: record => record.id,
    getCardProps: record => ({
      onClick: () => console.log('card click', record.id),
      'aria-label': `Открыть карточку ${record.id}`,
      'data-testid': `card-${record.id}`,
    }),
    children: record => (
      <div className="flex w-full flex-col">
        <div className="flex w-full items-start justify-between gap-3">
          <Typography variant="h4" weight="medium">
            {record.name}
          </Typography>
          <Typography variant="p2" textColor="secondary">
            #
            {record.id}
          </Typography>
        </div>

        <div className="mt-3 flex w-full flex-col gap-2">
          <div className="flex w-full items-start justify-between gap-3">
            <Typography variant="p2" textColor="secondary" className="shrink-0">
              Возраст
            </Typography>
            <Typography variant="p2" className="text-right">
              {record.age}
            </Typography>
          </div>
          <div className="flex w-full items-start justify-between gap-3">
            <Typography variant="p2" textColor="secondary" className="shrink-0">
              Категория
            </Typography>
            <Typography variant="p2" className="text-right">
              {record.category.title}
            </Typography>
          </div>
          <div className="flex w-full items-start justify-between gap-3">
            <Typography variant="p2" textColor="secondary" className="shrink-0">
              Статус
            </Typography>
            <Typography variant="p2" className="text-right">
              {record.status}
            </Typography>
          </div>
        </div>
      </div>
    ),
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    loadingRows: 6,
  },
}

export const EmptyStateDefault: Story = {
  args: {
    items: [],
  },
}

export const EmptyStateCustomTexts: Story = {
  args: {
    items: [],
    locale: {
      emptyTitle: 'Пока пусто',
      emptyDescription: 'Создайте первую запись, чтобы увидеть данные',
    },
  },
}
