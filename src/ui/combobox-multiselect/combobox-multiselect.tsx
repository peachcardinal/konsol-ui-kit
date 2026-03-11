import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { ListProps } from '../combobox-primitive/types'

import { Icon } from '@/components/icon'
import { Item, List } from '@/components/ui/combobox-primitive'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

import { useComboboxItems } from '../combobox-primitive/hooks'
import { getInputClasses, getLabelClasses, hasError } from '../combobox-primitive/utils'
import { ComboboxMultiSelectProvider, useComboboxMultiSelectContext } from './combobox-multiselect-context'
import {
  ComboboxActions,
  ComboboxContainer,
  ComboboxItemRenderer,
  ComboboxMenu,
} from './components'

type KeyGetter<T> = (option: T) => string

function defaultGetKey<T>(value: T): string {
  if (value === null || value === undefined) {
    return String(value)
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

interface ComboboxMultiSelectProps<T extends object> {
  children: React.ReactNode
  value?: T[] | undefined
  onChange?: (value: T[]) => void
  onSearch?: (value: string) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  classNames?: {
    scrollArea?: string
    scrollAreaViewport?: string
    menu?: string
  }
  size?: 'xs' | 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  transparent?: boolean
  label?: string
  error?: string
  caption?: string
  placeholder?: string
  disabled?: boolean
  'data-testid'?: string
  getLabel?: (value: T) => string
  getKey?: KeyGetter<T>
  loading?: boolean
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  showErrorMessage?: boolean
  clearable?: boolean
  onClear?: () => void
  maxTags?: number
}

function MultiSelectInput<T extends object>({
  selected,
  onRemove,
  getLabel,
  getKey,
  maxTags,
  'data-testid': dataTestId,
}: {
  selected: T[]
  onRemove: (option: T) => void
  getLabel: (value: T) => string
  getKey: KeyGetter<T>
  maxTags: number
  'data-testid'?: string
}) {
  const {
    size,
    fullWidth,
    disabled,
    placeholder,
    getInputProps,
    onOpenChange,
  } = useComboboxMultiSelectContext<T>()

  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [visibleCount, setVisibleCount] = useState(2)

  useLayoutEffect(() => {
    if (!selected.length || !containerRef.current) {
      return
    }

    const calculateVisibleCount = () => {
      const container = containerRef.current
      if (!container) {
        return
      }

      const containerWidth = container.offsetWidth
      const minInputWidth = 56
      const counterWidth = 30
      const padding = 8

      const availableWidth = containerWidth - minInputWidth - counterWidth - padding

      let currentCount = 0
      let totalWidth = 0

      // Примерные размеры элемента (как в select multiselect)
      const basePadding = 12 // px-1.5 * 2
      const closeIconWidth = 20
      const gapBetweenElements = 4
      const charWidth = 7 // 14px шрифт

      for (let i = 0; i < selected.length; i++) {
        const value = getLabel(selected[i])
        const textWidth = value.length * charWidth
        const elementWidth = basePadding + textWidth + closeIconWidth + gapBetweenElements

        if (totalWidth + elementWidth <= availableWidth) {
          totalWidth += elementWidth
          currentCount = i + 1
        } else {
          break
        }
      }

      const limited = Math.max(1, currentCount)
      setVisibleCount(maxTags ? Math.min(limited, maxTags) : limited)
    }

    calculateVisibleCount()

    const resizeObserver = new ResizeObserver(calculateVisibleCount)
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [getLabel, maxTags, selected])

  const visible = selected.slice(0, visibleCount)
  const overflow = Math.max(0, selected.length - visibleCount)

  const inputProps = getInputProps({
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) {
        return
      }

      if (event.key === 'Backspace' && event.currentTarget.value === '' && selected.length > 0) {
        event.preventDefault()
        onRemove(selected[selected.length - 1])
      }
    },
  })

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex min-w-0 flex-1 items-center justify-start gap-1 overflow-hidden',
        size === 'xs' ? 'pl-1.5' : 'pl-2',
        'pr-2',
      )}
      onMouseDown={(event) => {
        if (disabled) {
          return
        }

        const target = event.target as HTMLElement | null
        const isInteractive = target?.closest('button,[role="button"]') !== null
        if (!isInteractive) {
          event.preventDefault()
          inputRef.current?.focus()
          onOpenChange?.(true)
        }
      }}
    >
      {visible.map(option => (
        <div
          key={getKey(option)}
          className={cn(
            'flex flex-shrink-0 items-center gap-1 rounded bg-[#EFEFF1] px-1.5 py-0.5 text-sm',
            disabled && 'opacity-60',
          )}
        >
          <Typography variant="p2">{getLabel(option)}</Typography>
          <div
            onPointerDown={(e) => {
              if (disabled) {
                return
              }
              e.preventDefault()
              e.stopPropagation()
            }}
            onMouseDown={(e) => {
              if (disabled) {
                return
              }
              e.preventDefault()
              e.stopPropagation()
            }}
            onClick={(e) => {
              if (disabled) {
                return
              }
              e.preventDefault()
              e.stopPropagation()
              onRemove(option)
            }}
            className={cn(
              'flex cursor-pointer items-center rounded p-0.5 hover:bg-gray-200',
              disabled && 'cursor-not-allowed',
            )}
            role="button"
            tabIndex={-1}
            aria-label="Удалить"
          >
            <Icon icon="CloseIcon" size={12} className="!text-secondary" />
          </div>
        </div>
      ))}

      {overflow > 0 && (
        <div
          className={cn(
            'flex flex-shrink-0 items-center gap-1 rounded bg-[#EFEFF1] px-2 py-0.5 text-sm',
          )}
          role="button"
          tabIndex={0}
          onPointerDown={(e) => {
            if (disabled) {
              return
            }
            e.preventDefault()
            e.stopPropagation()
          }}
          onMouseDown={(e) => {
            if (disabled) {
              return
            }
            e.preventDefault()
            e.stopPropagation()
          }}
          onClick={(e) => {
            if (disabled) {
              return
            }
            e.preventDefault()
            e.stopPropagation()
            inputRef.current?.focus()
            onOpenChange?.(true)
          }}
        >
          <Typography variant="p2">
            +
            {overflow}
          </Typography>
        </div>
      )}

      <input
        ref={(node) => {
          inputRef.current = node
        }}
        {...inputProps}
        data-testid={dataTestId}
        value={inputProps.value || ''}
        disabled={disabled}
        placeholder={selected.length > 0 ? '' : placeholder}
        className={cn(
          getInputClasses(size, fullWidth, disabled),
          '!w-auto !min-w-[2px] !flex-1 !px-0 !py-0 !pl-0 !pr-0',
        )}
      />
    </div>
  )
}

interface ComboboxMultiSelectComponent {
  <T extends object>(props: ComboboxMultiSelectProps<T>): React.ReactElement
  Item: typeof Item
  List: React.ForwardRefExoticComponent<ListProps & React.RefAttributes<HTMLDivElement>>
}

function ComboboxMultiSelectBase<T extends object>({
  children,
  value: propsValue = [],
  onChange,
  onSearch: onSearchProp,
  onBlur,
  size = 'sm',
  fullWidth = true,
  transparent = false,
  classNames,
  label,
  error,
  caption,
  placeholder = 'Поиск...',
  disabled = false,
  'data-testid': dataTestId,
  getLabel = (value: T) => (typeof value === 'object' && value !== null && 'label' in value ? value.label as string : ''),
  getKey = defaultGetKey,
  loading = false,
  isOpen,
  onOpenChange,
  showErrorMessage = true,
  clearable = true,
  onClear,
  maxTags = 4,
}: ComboboxMultiSelectProps<T>) {
  const { items } = useComboboxItems<T>(children, getLabel)

  const selected = useMemo(() => propsValue || [], [propsValue])
  const selectedKeySet = useMemo(() => new Set(selected.map(getKey)), [selected, getKey])
  const [searchValue, setSearchValue] = useState('')

  const handleToggle = useCallback((option: T) => {
    const key = getKey(option)
    const isSelected = selectedKeySet.has(key)
    const next = isSelected ? selected.filter(v => getKey(v) !== key) : [...selected, option]
    onChange?.(next)
  }, [getKey, onChange, selected, selectedKeySet])

  const handleRemove = useCallback((option: T) => {
    const key = getKey(option)
    onChange?.(selected.filter(v => getKey(v) !== key))
  }, [getKey, onChange, selected])

  const handleClear = useCallback(() => {
    onChange?.([])
    onClear?.()
  }, [onChange, onClear])

  const handleOpenChange = useCallback((open: boolean) => {
    onOpenChange?.(open)
    if (!open) {
      setSearchValue('')
      onSearchProp?.('')
    }
  }, [onOpenChange, onSearchProp])

  const handleSearch = useCallback((q: string) => {
    setSearchValue(q)
    onSearchProp?.(q)
  }, [onSearchProp])

  return (
    <ComboboxMultiSelectProvider
      getLabel={getLabel}
      items={items}
      inputValue={searchValue}
      onChange={(option) => {
        if (option) {
          handleToggle(option)
        }
      }}
      onSearch={handleSearch}
      onBlur={onBlur}
      size={size}
      fullWidth={fullWidth}
      transparent={transparent}
      disabled={disabled}
      error={error}
      placeholder={placeholder}
      loading={loading}
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      clearable={clearable}
      onClear={handleClear}
      keepOpenOnSelect
      inputValueOnSelect="preserve"
      inputValueOnClose="preserve"
      isItemSelected={(option: T) => selectedKeySet.has(getKey(option))}
      hasSelection={selected.length > 0}
    >
      <div className="w-full">
        {label && (
          <Typography
            variant="p3"
            weight="medium"
            className={getLabelClasses(size)}
          >
            {label}
          </Typography>
        )}

        <ComboboxContainer>
          <MultiSelectInput
            selected={selected}
            onRemove={handleRemove}
            getLabel={getLabel}
            getKey={getKey}
            maxTags={maxTags}
            data-testid={dataTestId}
          />
          <ComboboxActions />
        </ComboboxContainer>

        <ComboboxMenu className={cn('p-1', classNames?.menu)}>
          <ComboboxItemRenderer<T>
            classNames={{
              scrollArea: cn('gap-0.5', classNames?.scrollArea),
              scrollAreaViewport: cn('gap-0.5', classNames?.scrollAreaViewport),
            }}
          >
            {children}
          </ComboboxItemRenderer>
        </ComboboxMenu>

        {caption && (
          <Typography variant="p1" className="mt-1.5" textColor="secondary">
            {caption}
          </Typography>
        )}

        {hasError(error) && showErrorMessage && (
          <Typography variant="p2" className="mt-1.5" textColor="destructive">
            {error}
          </Typography>
        )}
      </div>
    </ComboboxMultiSelectProvider>
  )
}

export const ComboboxMultiSelect = ComboboxMultiSelectBase as ComboboxMultiSelectComponent

ComboboxMultiSelect.Item = Item
ComboboxMultiSelect.List = List
