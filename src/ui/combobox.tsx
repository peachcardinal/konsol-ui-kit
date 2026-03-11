// Combobox.tsx
import React from 'react'

import type { ButtonSize } from './button'

import * as Popover from '@radix-ui/react-popover'

import { cn } from '@/lib/utils'

import { Icon } from './Icon'
import { Button } from './button'
import { InputSearch } from '../Input'
import { Typography } from '../Typography'

/* ───── Типы ───── */
export type ComboboxSize = 'xs' | 'sm' | 'md' | 'lg'

export interface ComboboxOption {
  value: string | number
  label?: React.ReactNode | string
}

export interface ComboboxProps {
  /** Элементы списка */
  options: ComboboxOption[]
  /** Текущее значение */
  value: string | number | null
  /** Сallback при выборе */
  onChange: (value: string | number) => void
  /** Размер (как в старом Select) */
  size?: ComboboxSize
  /** Лейбл над полем */
  label?: string
  /** Плейсхолдер в поиске */
  searchPlaceholder?: string
  /** Ошибка */
  error?: string
  /** Фулл-ширина */
  fullWidth?: boolean
  /** disabled */
  disabled?: boolean
  /** размер кнопки */
  sizeButton?: ButtonSize
  iconSize?: number
  placeholder?: string
  dropDownClassName?: string
  notFoundText?: string
}

/* ───── Вспом. функции ───── */
const sizeClasses: Record<ComboboxSize, string> = {
  xs: 'h-6 text-[12px]',
  sm: 'h-8 text-[14px]',
  md: 'h-9 text-[14px]',
  lg: 'h-10 text-[16px]',
}

/* ───── Основной компонент ───── */
export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onChange,
      size = 'sm',
      label,
      searchPlaceholder = 'Поиск...',
      error,
      fullWidth: _fullWidth = true,
      sizeButton = 'md',
      disabled,
      iconSize = 16,
      placeholder = 'Выберите...',
      dropDownClassName,
      notFoundText = 'Ничего не найдено',
    },
    _ref,
  ) => {
    /* локальный поиск                                               */
    const [open, setOpen] = React.useState(false)
    const searchRef = React.useRef<HTMLInputElement>(null)

    /* ставим фокус при каждом открытии                              */
    React.useEffect(() => {
      if (open) {
        requestAnimationFrame(() => searchRef.current?.focus())
      }
    }, [open])

    /* фильтр                                                        */
    const [query, setQuery] = React.useState('')

    // Функция для извлечения текста из React элемента (как в Select)
    const extractText = React.useCallback((element: any): string => {
      if (typeof element === 'string') {
        return element
      }
      if (React.isValidElement(element)) {
        const props = element.props as { children?: React.ReactNode }
        if (typeof props.children === 'string') {
          return props.children
        }
        if (Array.isArray(props.children)) {
          return props.children.map(extractText).join(' ')
        }
        return extractText(props.children)
      }
      return ''
    }, [])

    const filtered = React.useMemo(() => {
      if (!query)
        return options

      return options.filter((option) => {
        const searchText = extractText(option.label)
        return searchText.toLowerCase().includes(query.toLowerCase())
      })
    }, [options, query, extractText])

    return (
      <div className="w-full">
        {label && (
          <Typography variant="p3" weight="medium" className="mb-2.5">
            {label}
          </Typography>
        )}

        <Popover.Root open={open} onOpenChange={setOpen} modal>
          <Popover.Trigger asChild>
            <Button
              variant="dashed"
              disabled={disabled}
              size={sizeButton}
              iconPosition="end"
              className={cn(
                'font-graphik hover:text-secondary-foreground focus:text-secondary-foreground active:text-secondary-foreground w-full justify-start border-1 border-solid text-left text-[16px] leading-[22px]',
                'focus:shadow-focus border focus:outline-none',
                'bg-background border-border placeholder:text-muted-foreground enabled:hover:border-primary focus:border-primary disabled:bg-input-disabled-background',
                // Стили для открытого состояния
                open && 'border-primary shadow-focus',
                {
                  'shadow-error border-destructive border-1 border-solid':
                    error !== undefined && error !== null,
                },
                {
                  'bg-background placeholder:text-muted-foreground disabled:bg-input-disabled-background border-destructive focus:border-destructive enabled:hover:border-destructive':
                    error !== undefined && error !== null,
                },
                error !== undefined &&
                error !== null &&
                (open ?
                  'border-destructive shadow-error' :
                  'hover:text-destructive'),
              )}
            >
              <Typography
                className={cn(
                  'flex-1 truncate text-left',
                  !value && 'text-muted-foreground',
                )}
              >
                {value ?
                  options.find(o => o.value === value)?.label :
                  placeholder}
              </Typography>

              <Icon
                icon="ArrowDownIcon"
                size={iconSize as any}
                className="text-muted-foreground ml-1"
              />
            </Button>
          </Popover.Trigger>

          <Popover.Content
            sideOffset={4}
            className={cn(
              'z-[1000]',
              'shadow-md',
              'bg-popover text-popover-foreground shadow-lg',
              'border-border rounded-lg border-1 border-solid',
              'max-h-80 w-[var(--radix-popover-trigger-width)] overflow-hidden',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 no-scrollbar',
              dropDownClassName,
            )}
          >
            {/* поиск */}
            <InputSearch
              ref={searchRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              size="md"
              type="border"
              className="-mt-1 w-[calc(100%+8px)]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setOpen(false)
                  e.stopPropagation()
                }
              }}
            />

            {/* список */}
            <div className="max-h-60 overflow-y-auto">
              {filtered.length === 0 && (
                <div className="text-muted-foreground px-3 py-2 text-sm">
                  {notFoundText}
                </div>
              )}
              <div className="flex flex-col gap-0.5 p-1">
                {filtered.map(opt => (
                  <div
                    key={opt.value}
                    className={cn(
                      'font-graphik flex cursor-pointer items-center rounded-md px-3 transition-colors select-none',
                      'box-border outline-none',
                      // Разные ховеры для выбранного и невыбранного элемента
                      value !== opt.value && 'hover:bg-muted',
                      value === opt.value &&
                      'bg-primary-10 font-medium hover:bg-[#F3E5FF]',
                      sizeClasses[size],
                    )}
                    onClick={() => {
                      onChange(opt.value)
                      setOpen(false)
                      setQuery('')
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onChange(opt.value)
                        setOpen(false)
                        setQuery('')
                      }
                    }}
                    tabIndex={0}
                    role="option"
                    aria-selected={value === opt.value}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>
          </Popover.Content>
        </Popover.Root>

        {error && (
          <Typography variant="p2" className="mt-1" textColor="destructive">
            {error}
          </Typography>
        )}
      </div>
    )
  },
)
Combobox.displayName = 'Combobox'
