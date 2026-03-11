import React, { useMemo, useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { ComboboxMultiSelect } from './combobox-multiselect'

interface Executor {
  id: string
  name: string
}

const meta = {
  title: 'UI/ComboboxMultiSelect',
  component: ComboboxMultiSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ComboboxMultiSelect>

export default meta
type Story = StoryObj<typeof ComboboxMultiSelect>

function makeExecutors(count: number): Executor[] {
  const base = [
    'Петровский И.В.',
    'Быстров И.И.',
    'Иванов И.И.',
    'Лапухов И.И.',
    'Сидорова А.А.',
    'Кузнецов П.П.',
    'Смирнов Д.Д.',
    'Фёдоров Е.Е.',
    'Васильев С.С.',
    'Попова Н.Н.',
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `e-${i + 1}`,
    name: base[i % base.length] + (i >= base.length ? ` ${i + 1}` : ''),
  }))
}

export const Default: Story = {
  render: () => {
    const all = useMemo(() => makeExecutors(40), [])
    const [selected, setSelected] = useState<Executor[]>([])
    const [query, setQuery] = useState('')

    const visible = useMemo(() => {
      const q = query.trim().toLowerCase()
      if (!q)
        return all
      return all.filter(x => x.name.toLowerCase().includes(q))
    }, [all, query])

    return (
      <div className="w-140 pb-60">
        <ComboboxMultiSelect<Executor>
          value={selected}
          size="lg"
          onChange={setSelected}
          getLabel={v => v.name}
          getKey={v => v.id}
          label="Исполнителям"
          placeholder="Поиск…"
          maxTags={4}
          clearable
          onClear={() => {
            setSelected([])
            setQuery('')
          }}
          onSearch={(q) => {
            setQuery(q)
          }}
          caption="Начните вводить для фильтрации"
        >
          <ComboboxMultiSelect.List>
            {visible.map(executor => (
              <ComboboxMultiSelect.Item key={executor.id} option={executor}>
                {executor.name}
              </ComboboxMultiSelect.Item>
            ))}
          </ComboboxMultiSelect.List>
        </ComboboxMultiSelect>
      </div>
    )
  },
}
