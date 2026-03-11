import * as React from 'react'

import type { Meta, StoryObj } from '@storybook/react'
import type { E164Number } from 'libphonenumber-js/core'

import { Button } from '../button'
import { DialogBase } from '../dialog/dialog-base/dialog-base'
import { PhoneInput } from './phone-input'

const meta = {
  title: 'UI/PhoneInput',
  component: PhoneInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PhoneInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: '(123) 456-78-90',
    autoFocus: true,
  },
}

export const WithError: Story = {
  args: {
    placeholder: '(123) 456-78-90',
    className: 'border-destructive',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: '(123) 456-78-90',
    disabled: true,
  },
}

export const WithValue: Story = {
  args: {
    value: '+79131500043' as E164Number,
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState<E164Number | undefined>(
      '+79131500043' as E164Number,
    )

    return (
      <div className="flex w-[600px] flex-col gap-4">
        <PhoneInput
          error="Ошибка"
          label="Телефон"
          value={value}
          onChange={newValue => setValue(newValue as E164Number)}
          placeholder="(123) 456-78-90"
        />
        <div className="text-sm">
          Текущее значение:
          {value || 'не задано'}
        </div>
      </div>
    )
  },
}

export const InitialCountry: Story = {
  render: () => {
    const [value, setValue] = React.useState<E164Number | undefined>(undefined)

    return (
      <div className="flex w-[600px] flex-col gap-4">
        <PhoneInput
          label="Телефон"
          value={value}
          onChange={newValue => setValue(newValue as E164Number)}
          placeholder="(123) 456-78-90"
          initialCountry="KZ"
        />
        <div className="text-sm">
          Текущее значение:
          {value || 'не задано'}
        </div>
      </div>
    )
  },
}

export const Localization: Story = {
  render: () => {
    const [value, setValue] = React.useState<E164Number | undefined>(undefined)
    const [locale, setLocale] = React.useState<'ru' | 'en' | 'uz' | 'tg'>('ru')

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="default"
            onClick={() => setLocale('ru')}
            isActive={locale === 'ru'}
          >
            Русский
          </Button>
          <Button
            variant="default"
            onClick={() => setLocale('en')}
            isActive={locale === 'en'}
          >
            English
          </Button>
          <Button
            variant="default"
            onClick={() => setLocale('uz')}
            isActive={locale === 'uz'}
          >
            O'zbek
          </Button>
          <Button
            variant="default"
            onClick={() => setLocale('tg')}
            isActive={locale === 'tg'}
          >
            Тоҷикӣ
          </Button>
        </div>

        <PhoneInput
          value={value}
          onChange={newValue => setValue(newValue as E164Number)}
          placeholder="(123) 456-78-90"
          locale={locale}
        />
      </div>
    )
  },
}

export const PhoneInputInModal: Story = {
  render: () => {
    const [value, setValue] = React.useState<E164Number | undefined>(undefined)

    return (
      <DialogBase
        width="md"
        visibleOverlay={true}
        visibleClose={true}
        disableAutoFocus={false}
        trigger={<Button>Open modal</Button>}
      >
        <DialogBase.Title>Введите номер телефона</DialogBase.Title>

        <DialogBase.Content>
          <div className="flex h-200 flex-col gap-4">
            <PhoneInput
              label="Номер телефона"
              value={value}
              onChange={newValue => setValue(newValue as E164Number)}
              autoFocus={true}
            />
          </div>
        </DialogBase.Content>
      </DialogBase>
    )
  },
}
