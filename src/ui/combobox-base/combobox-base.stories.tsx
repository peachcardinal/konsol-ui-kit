import React, { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../button'
import { ComboboxBase } from './combobox-base'

const meta = {
  title: 'UI/ComboboxBase',
  component: ComboboxBase,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ComboboxBase>

export default meta
type Story = StoryObj<typeof ComboboxBase>

const items = [
  { value: 'apple', test: 'Apple' },
  { value: 'banana', test: 'Banana' },
  { value: 'orange', test: 'Orange' },
  { value: 'carrot', test: 'Carrot asdf asdf asdfasdfasdfsadf asdfasdf asdf asfasdfafsdf' },
  { value: 'grape', test: 'Grape' },
  { value: 'melon', test: 'Melon' },
  { value: 'peach', test: 'Peach' },
  { value: 'plum', test: 'Plum' },
  { value: 'strawberry', test: 'Strawberry' },
  { value: 'watermelon', test: 'Watermelon' },
  { value: 'pineapple', test: 'Pineapple' },
  { value: 'quince', test: 'Quince' },
  { value: 'lime', test: 'Lime' },
  { value: 'cherry', test: 'Cherry' },
  { value: 'x', test: 'X' },
  { value: 'y', test: 'Y' },
  { value: 'z', test: 'Z' },
]

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<{ value: string, test: string } | null>(null)
    const [visibleItems, setVisibleItems] = useState<{ value: string, test: string }[]>([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [disabled, setDisabled] = useState(false)

    return (
      <div className="w-[280px] space-y-4">
        <div className="flex gap-2">
          <Button onClick={() => {
            setDisabled(true)
          }}
          >
            Disabled
          </Button>

          <Button onClick={() => {
            setVisibleItems([items[1]])
          }}
          >
            Меняем items
          </Button>

          <Button onClick={() => {
            setValue(null)
          }}
          >
            Сбросить value
          </Button>

          <Button onClick={() => {
            setValue({ value: 'apple', test: 'Apple' })
          }}
          >
            Установить Apple
          </Button>
          <Button onClick={() => {
            setValue({ value: 'test', test: 'Test' })
          }}
          >
            Установить Test
          </Button>
        </div>

        <ComboboxBase<{ test: string, value: string }>
          value={value}
          onChange={(value) => {
            setVisibleItems(items)
            setValue(value)
          }}
          loading={loading}
          getLabel={value => value.test}
          label="Выберите фрукт"
          placeholder="Поиск фруктов..."
          caption="Начните печатать для поиска"
          onBlur={() => {
            console.log('onBlur')
          }}
          clearable
          onClear={() => {
            setValue(null)
            console.log('onClear')
          }}
          disabled={disabled}
          onSearch={(searchValue) => {
            const promise = new Promise((resolve) => {
              setTimeout(() => {
                setVisibleItems(items.filter(item => item.test.toLowerCase().includes(searchValue.toLowerCase())))
                resolve(void 0)
              }, 2000)
            })

            setLoading(true)
            setVisibleItems([])

            promise.finally(() => {
              setLoading(false)
            })
          }}
          isOpen={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen)
          }}
          classNames={{
            scrollArea: 'max-h-20',
            menu: 'gap-0',
          }}
        >
          <div>
            <button onClick={() => {
              setOpen(false)
            }}
            >
              close
            </button>
          </div>

          <ComboboxBase.List>
            {visibleItems.map(item => (
              <ComboboxBase.Item
                key={item.test}
                option={item}
              >
                {item.test}
              </ComboboxBase.Item>
            ))}
          </ComboboxBase.List>
        </ComboboxBase>
        <div>
          value:
          {JSON.stringify(value)}
        </div>
      </div>
    )
  },
}
