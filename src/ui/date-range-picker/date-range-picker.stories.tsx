import React from 'react'
import type { DateRange } from 'react-day-picker'

import type { Meta, StoryObj } from '@storybook/react'

import { addDays, startOfToday } from 'date-fns'

import { Button } from './button'
import { DateRangePicker } from './date-range-picker'
import { DialogBase } from './dialog/dialog-base/dialog-base'
import { Typography } from './typography'

const meta = {
  title: 'UI/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'object' },
    onDateChange: { action: 'dateChanged' },
    locale: {
      control: 'select',
      options: ['ru', 'en', 'uz', 'tg'],
    },
  },
} satisfies Meta<typeof DateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: undefined,
    onDateChange: () => {},
  },
  render: (args) => {
    const [date, setDate] = React.useState<DateRange | undefined>(args.value)

    const handleDateChange = (newDate: DateRange | undefined) => {
      setDate(newDate)
      args.onDateChange?.(newDate)
    }

    return (
      <div className="w-72">
        <DateRangePicker
          {...args}
          value={date}
          onDateChange={handleDateChange}
        />
      </div>
    )
  },
}

export const WithDateRange: Story = {
  args: {
    value: {
      from: new Date(2025, 1, 12),
      to: new Date(2025, 1, 24),
    },
    onDateChange: () => {},
  },
  render: (args) => {
    const [date, setDate] = React.useState<DateRange | undefined>(args.value)

    const handleDateChange = (newDate: DateRange | undefined) => {
      setDate(newDate)
      args.onDateChange?.(newDate)
    }

    return (
      <div className="w-72">
        <DateRangePicker
          {...args}
          value={date}
          onDateChange={handleDateChange}
        />
      </div>
    )
  },
}

export const WithDateRangeError: Story = {
  args: {
    value: {
      from: new Date(2025, 1, 12),
      to: new Date(2025, 1, 24),
    },
    onDateChange: () => {},
  },
  render: (args) => {
    const [date, setDate] = React.useState<DateRange | undefined>(args.value)

    const handleDateChange = (newDate: DateRange | undefined) => {
      setDate(newDate)
      args.onDateChange?.(newDate)
    }

    return (
      <div className="w-72">
        <DateRangePicker
          error="Поле обязательно для заполнения"
          label="Дата"
          placeholder={{ from: 'дд.мм.гггг', to: 'дд.мм.гггг' }}
          {...args}
          size="lg"
          value={date}
          onDateChange={handleDateChange}
        />
      </div>
    )
  },
}

export const WithSingleDate: Story = {
  args: {
    value: {
      from: new Date(2025, 1, 15),
      to: undefined,
    },
    onDateChange: () => {},
  },
  render: (args) => {
    const [date, setDate] = React.useState<DateRange | undefined>(args.value)

    const handleDateChange = (newDate: DateRange | undefined) => {
      setDate(newDate)
      args.onDateChange?.(newDate)
    }

    return (
      <div className="w-72">
        <DateRangePicker
          {...args}
          value={date}
          onDateChange={handleDateChange}
        />
      </div>
    )
  },
}

export const WithFromError: Story = {
  args: {
    value: {
      from: new Date(2025, 1, 12),
      to: new Date(2025, 1, 24),
    },
    onDateChange: () => {},
  },
  render: (args) => {
    const [date, setDate] = React.useState<DateRange | undefined>(args.value)

    const handleDateChange = (newDate: DateRange | undefined) => {
      setDate(newDate)
      args.onDateChange?.(newDate)
    }

    return (
      <div className="w-72">
        <DateRangePicker
          error={{ from: 'Дата начала не может быть в прошлом' }}
          label="Дата с ошибкой ОТ"
          placeholder={{ from: 'дд.мм.гггг', to: 'дд.мм.гггг' }}
          {...args}
          size="lg"
          value={date}
          onDateChange={handleDateChange}
        />
      </div>
    )
  },
}

export const WithToError: Story = {
  args: {
    value: {
      from: new Date(2025, 1, 12),
      to: new Date(2025, 1, 24),
    },
    onDateChange: () => {},
  },
  render: (args) => {
    const [date, setDate] = React.useState<DateRange | undefined>(args.value)

    const handleDateChange = (newDate: DateRange | undefined) => {
      setDate(newDate)
      args.onDateChange?.(newDate)
    }

    return (
      <div className="w-72">
        <DateRangePicker
          error={{ to: 'Дата окончания должна быть больше даты начала' }}
          label="Дата с ошибкой ДО"
          placeholder={{ from: 'дд.мм.гггг', to: 'дд.мм.гггг' }}
          {...args}
          size="lg"
          value={date}
          onDateChange={handleDateChange}
        />
      </div>
    )
  },
}

export const WithBothErrors: Story = {
  args: {
    value: {
      from: new Date(2025, 1, 12),
      to: new Date(2025, 1, 24),
    },
    onDateChange: () => {},
  },
  render: (args) => {
    const [date, setDate] = React.useState<DateRange | undefined>(args.value)

    const handleDateChange = (newDate: DateRange | undefined) => {
      setDate(newDate)
      args.onDateChange?.(newDate)
    }

    return (
      <div className="w-72">
        <DateRangePicker
          error={{
            from: 'Неверная дата начала',
            to: 'Неверная дата окончания',
          }}
          label="Даты с обеими ошибками"
          placeholder={{ from: 'дд.мм.гггг', to: 'дд.мм.гггг' }}
          {...args}
          size="lg"
          value={date}
          onDateChange={handleDateChange}
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    value: undefined,
    onDateChange: () => {},
    disabled: true,
    placeholder: { from: 'дд.мм.гггг', to: 'дд.мм.гггг' },
  },
  render: (args) => {
    const [date, setDate] = React.useState<DateRange | undefined>(args.value)

    const handleDateChange = (newDate: DateRange | undefined) => {
      setDate(newDate)
      args.onDateChange?.(newDate)
    }

    return (
      <div className="w-72">
        <DateRangePicker
          {...args}
          value={date}
          onDateChange={handleDateChange}
        />
      </div>
    )
  },
}

export const DisableBeforeToday: Story = {
  args: {
    value: undefined,
    onDateChange: () => {},
  },
  render: (args) => {
    const [date, setDate] = React.useState<DateRange | undefined>(args.value)
    const today = startOfToday()
    const disabledDays = { before: today }

    const handleDateChange = (newDate: DateRange | undefined) => {
      setDate(newDate)
      args.onDateChange?.(newDate)
    }

    return (
      <div className="w-72">
        <DateRangePicker
          {...args}
          value={date}
          onDateChange={handleDateChange}
          disabledDays={disabledDays}
          caption="Доступно только сегодня и далее"
        />
      </div>
    )
  },
}

export const OnlyTodayPlus2: Story = {
  args: {
    value: undefined,
    onDateChange: () => {},
  },
  render: (args) => {
    const [date, setDate] = React.useState<DateRange | undefined>(args.value)
    const today = startOfToday()
    const afterTwo = addDays(today, 2)
    const disabledDays = [{ before: today }, { after: afterTwo }]

    const handleDateChange = (newDate: DateRange | undefined) => {
      setDate(newDate)
      args.onDateChange?.(newDate)
    }

    return (
      <div className="w-72">
        <DateRangePicker
          {...args}
          value={date}
          onDateChange={handleDateChange}
          disabledDays={disabledDays}
          caption="Доступен период: сегодня, +1 и +2 дня"
        />
      </div>
    )
  },
}

export const WithEnglishLocale: Story = {
  args: {
    value: {
      from: new Date(2025, 1, 12),
      to: new Date(2025, 1, 24),
    },
    locale: 'en',
    onDateChange: () => {},
  },
  render: (args) => {
    const [date, setDate] = React.useState<DateRange | undefined>(args.value)

    const handleDateChange = (newDate: DateRange | undefined) => {
      setDate(newDate)
      args.onDateChange?.(newDate)
    }

    return (
      <div className="w-72">
        <DateRangePicker
          {...args}
          label="Date"
          value={date}
          onDateChange={handleDateChange}
        />
      </div>
    )
  },
}

export const WithUzbekLocale: Story = {
  args: {
    value: {
      from: new Date(2025, 1, 12),
      to: new Date(2025, 1, 24),
    },
    locale: 'uz',
    onDateChange: () => {},
  },
  render: (args) => {
    const [date, setDate] = React.useState<DateRange | undefined>(args.value)

    const handleDateChange = (newDate: DateRange | undefined) => {
      setDate(newDate)
      args.onDateChange?.(newDate)
    }

    return (
      <div className="w-72">
        <DateRangePicker
          {...args}
          label="Sana"
          value={date}
          onDateChange={handleDateChange}
        />
      </div>
    )
  },
}

export const WithTajikLocale: Story = {
  args: {
    value: {
      from: new Date(2025, 1, 12),
      to: new Date(2025, 1, 24),
    },
    locale: 'tg',
    onDateChange: () => {},
  },
  render: (args) => {
    const [date, setDate] = React.useState<DateRange | undefined>(args.value)

    const handleDateChange = (newDate: DateRange | undefined) => {
      setDate(newDate)
      args.onDateChange?.(newDate)
    }

    return (
      <div className="w-72">
        <DateRangePicker
          {...args}
          label="Сана"
          value={date}
          onDateChange={handleDateChange}
        />
      </div>
    )
  },
}

export const InsideModal: Story = {
  args: {
    value: undefined,
    onDateChange: () => {},
  },
  render: (args) => {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<DateRange | undefined>(args.value)

    const handleDateChange = (newDate: DateRange | undefined) => {
      setDate(newDate)
      args.onDateChange?.(newDate)
    }

    const formattedValue = (() => {
      const from = date?.from ? date.from.toLocaleDateString('ru-RU') : '—'
      const to = date?.to ? date.to.toLocaleDateString('ru-RU') : '—'
      return `${from} → ${to}`
    })()

    return (
      <DialogBase
        open={open}
        onOpenChange={setOpen}
        width="md"
        trigger={<Button variant="default">Открыть модалку с DateRangePicker</Button>}
      >
        <DialogBase.Title>Выбор периода</DialogBase.Title>

        <DialogBase.Content>
          <div className="flex flex-col gap-4">
            <Typography variant="p2" textColor="secondary">
              DateRangePicker находится внутри модалки. Откройте пикер и выберите
              период, не закрывая внешнюю модалку.
            </Typography>

            <div className="w-72">
              <DateRangePicker
                {...args}
                label="Период"
                value={date}
                onDateChange={handleDateChange}
              />
            </div>

            <Typography variant="p2" textColor="secondary">
              Текущее значение:
              {' '}
              {formattedValue}
            </Typography>
          </div>
        </DialogBase.Content>

        <DialogBase.Footer>
          <DialogBase.Close>
            <Button variant="dashed" className="w-full">
              Закрыть
            </Button>
          </DialogBase.Close>
        </DialogBase.Footer>
      </DialogBase>
    )
  },
}
