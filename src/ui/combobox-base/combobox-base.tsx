import React, { useMemo } from 'react'

import type { ComboboxPrimitiveProps, ListProps } from '../combobox-primitive/types'

import { ComboboxPrimitiveProvider } from '../combobox-primitive/combobox-primitive-context'
import {
  ComboboxActions,
  ComboboxContainer,
  ComboboxInput,
  ComboboxItemRenderer,
  ComboboxMenu,
  Item,
  List,
} from '../combobox-primitive/components'
import { useComboboxItems } from '../combobox-primitive/hooks'
import { getLabelClasses, hasError } from '../combobox-primitive/utils'
import { Typography } from '../../Typography'

interface ComboboxPrimitiveComponent {
  <T extends object>(props: ComboboxPrimitiveProps<T>): React.ReactElement
  Item: typeof Item
  List: React.ForwardRefExoticComponent<ListProps & React.RefAttributes<HTMLDivElement>>
}

function ComboboxPrimitiveBase<T extends object>({
  children,
  value: propsValue,
  onChange,
  onSearch,
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
  loading = false,
  isOpen,
  onOpenChange,
  showErrorMessage = true,
  clearable,
  onClear,
}: ComboboxPrimitiveProps<T>) {
  // Извлекаем элементы из children
  const { items } = useComboboxItems<T>(children, getLabel)

  const value = useMemo(() => {
    return propsValue
  }, [propsValue])

  return (
    <ComboboxPrimitiveProvider
      getLabel={getLabel}
      items={items}
      value={value}
      onChange={onChange}
      onSearch={onSearch}
      onBlur={onBlur}
      size={size}
      fullWidth={fullWidth}
      transparent={transparent}
      disabled={disabled}
      error={error}
      placeholder={placeholder}
      loading={loading}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      clearable={clearable}
      onClear={onClear}
    >
      <div className="w-full">
        {/* Лейбл */}
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
          <ComboboxInput data-testid={dataTestId} />

          <ComboboxActions />
        </ComboboxContainer>

        <ComboboxMenu className={classNames?.menu}>
          <ComboboxItemRenderer<T> classNames={{
            scrollArea: classNames?.scrollArea,
            scrollAreaViewport: classNames?.scrollAreaViewport,
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
    </ComboboxPrimitiveProvider>
  )
}

// Создаём типизированный компонент с привязанными вложенными компонентами
export const ComboboxBase = ComboboxPrimitiveBase as ComboboxPrimitiveComponent

// Присоединяем вложенные компоненты
ComboboxBase.Item = Item
ComboboxBase.List = List
