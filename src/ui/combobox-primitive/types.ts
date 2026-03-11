import type React from 'react'

export type ComboboxPrimitiveSize = 'xs' | 'sm' | 'md' | 'lg'

export interface ComboboxPrimitiveItem<T = any> {
  value: T
  label: string
}

export interface ComboboxPrimitiveProps<T extends object> {
  children: React.ReactNode
  onChange?: (option: T | null) => void
  onSearch?: (value: string) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Контролируемое значение поля поиска */
  inputValue?: string
  /** Поведение при выборе: держать меню открытым */
  keepOpenOnSelect?: boolean
  /** Что делать со значением input при выборе элемента */
  inputValueOnSelect?: 'selectedLabel' | 'clear' | 'preserve'
  /** Что делать со значением input при закрытии меню */
  inputValueOnClose?: 'selectedLabel' | 'clear' | 'preserve'
  /** Кастомная проверка выбранности (для мультиселекта) */
  isItemSelected?: (option: T) => boolean
  /** Есть ли выбранные значения (для отображения кнопки очистки) */
  hasSelection?: boolean
  classNames?: {
    scrollArea?: string
    scrollAreaViewport?: string
    menu?: string
  }
  /** Размер селекта поиска */
  size?: ComboboxPrimitiveSize
  /** Растягивать ли селект на всю ширину */
  fullWidth?: boolean
  /** Прозрачный фон */
  transparent?: boolean
  /** Лейбл */
  label?: string
  /** Ошибка */
  error?: string
  /** Подпись */
  caption?: string
  /** Плейсхолдер для поиска */
  placeholder?: string
  /** Отключен ли селект */
  disabled?: boolean
  /** Тест-ид */
  'data-testid'?: string
  /** Значение */
  value?: T | null | undefined
  getLabel?: (value: T) => string
  loading?: boolean
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  showErrorMessage?: boolean
  clearable?: boolean
  onClear?: () => void
}

export interface ListProps {
  children: React.ReactNode
  className?: string
}

export interface ItemProps<T = unknown> {
  option: T
  children: React.ReactNode | ((props: ItemRenderProps) => React.ReactNode)
  className?: string
}

export interface ItemRenderProps extends React.HTMLAttributes<HTMLDivElement> {
  isSelected: boolean
  className?: string
}

export interface ItemViewProps {
  children: React.ReactNode | ((props: ItemRenderProps) => React.ReactNode)
  isSelected: boolean
  className?: string
}
