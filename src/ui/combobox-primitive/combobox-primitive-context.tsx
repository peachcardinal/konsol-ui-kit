import React, { createContext, useCallback, useContext, useMemo } from 'react'

import type { ComboboxPrimitiveItem, ComboboxPrimitiveProps } from './types'

import { autoUpdate, flip, offset, shift, size as sizeMiddleware, useFloating, useTransitionStyles } from '@floating-ui/react'
import { useCombobox } from 'downshift'

/**
 * Контекст для состояния combobox
 */
interface ComboboxPrimitiveContextValue<T extends object> {
  // Combobox состояние
  getInputProps: ReturnType<typeof useCombobox>['getInputProps']
  getItemProps: ReturnType<typeof useCombobox>['getItemProps']
  getMenuProps: ReturnType<typeof useCombobox>['getMenuProps']
  getToggleButtonProps: ReturnType<typeof useCombobox>['getToggleButtonProps']
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  selectedItem: ComboboxPrimitiveItem<T> | null
  setInputValue: ReturnType<typeof useCombobox>['setInputValue']

  // Floating UI состояние
  refs: ReturnType<typeof useFloating>['refs']
  floatingStyles: ReturnType<typeof useFloating>['floatingStyles']
  isMounted: boolean
  transitionStyles: ReturnType<typeof useTransitionStyles>['styles']

  // Пропсы компонента
  size: NonNullable<ComboboxPrimitiveProps<T>['size']>
  fullWidth: NonNullable<ComboboxPrimitiveProps<T>['fullWidth']>
  transparent: NonNullable<ComboboxPrimitiveProps<T>['transparent']>
  disabled: NonNullable<ComboboxPrimitiveProps<T>['disabled']>
  error: ComboboxPrimitiveProps<T>['error']
  placeholder: NonNullable<ComboboxPrimitiveProps<T>['placeholder']>
  onBlur: ComboboxPrimitiveProps<T>['onBlur']
  items: ComboboxPrimitiveItem<T>[]
  loading?: boolean
  getLabel: (value: T) => string
  onClear?: () => void
  clearable?: boolean
  selectItem: (item: any) => void
}

const ComboboxPrimitiveContext = createContext<ComboboxPrimitiveContextValue<any> | null>(null)

/**
 * Хук для получения контекста combobox
 */
export function useComboboxPrimitiveContext<T extends object>(): ComboboxPrimitiveContextValue<T> {
  const context = useContext(ComboboxPrimitiveContext)
  if (!context) {
    throw new Error('useComboboxPrimitiveContext must be used within ComboboxPrimitiveProvider')
  }
  return context
}

/**
 * Хук для работы с combobox логикой
 */
function useComboboxPrimitive<T>({
  items,
  value = null,
  onChange,
  onSearch,
  onBlur,
  disabled,
  getLabel,
  isOpen,
  onOpenChange,
}: {
  items: ComboboxPrimitiveItem<T>[]
  onChange?: (value: T | null) => void
  onSearch?: (value: string) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  disabled: boolean
  value?: any | null
  getLabel: (value: T) => string
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}) {
  // stateReducer для контроля изменений состояния downshift
  const stateReducer = useCallback((_state: any, actionAndChanges: any) => {
    const { type, changes } = actionAndChanges

    switch (type) {
      case useCombobox.stateChangeTypes.ItemClick:
      case useCombobox.stateChangeTypes.InputKeyDownEnter:
      case useCombobox.stateChangeTypes.InputKeyDownEscape:
      case useCombobox.stateChangeTypes.InputBlur:
        // При выборе элемента обновляем inputValue но не вызываем onInputValueChange
        return {
          ...changes,
          // Сохраняем inputValue из изменений, но предотвращаем вызов onInputValueChange
          inputValue: changes.selectedItem ? getLabel(changes.selectedItem.value) : (changes.inputValue || ''),
        }
      case useCombobox.stateChangeTypes.FunctionSelectItem:
        // При программном выборе также обновляем inputValue
        return {
          ...changes,
          inputValue: changes.selectedItem ? getLabel(changes.selectedItem.value) : (changes.inputValue || ''),
        }
      default:
        return changes
    }
  }, [getLabel])

  const { selectItem, setInputValue, getInputProps: downshiftGetInputProps, ...combobox } = useCombobox({
    items,
    stateReducer,
    selectedItem: value,
    isOpen,
    onIsOpenChange: (state) => {
      onOpenChange?.(state.isOpen)

      if (!state.isOpen) {
        setInputValue(state.selectedItem ? getLabel(state.selectedItem.value) : '')
      }
    },
    itemToString: (item) => {
      return item ? getLabel(item?.value) : ''
    },
    onInputValueChange: ({ inputValue, type }) => {
      if (disabled) {
        return
      }

      // Проверяем тип изменения - если это не выбор элемента, то вызываем onSearch
      if (
        type !== useCombobox.stateChangeTypes.ItemClick &&
        type !== useCombobox.stateChangeTypes.InputKeyDownEnter &&
        type !== useCombobox.stateChangeTypes.InputKeyDownEscape &&
        type !== useCombobox.stateChangeTypes.InputBlur &&
        type !== useCombobox.stateChangeTypes.FunctionSelectItem
      ) {
        onSearch?.(inputValue)
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (disabled)
        return

      const valueToChange = selectedItem?.value !== undefined && selectedItem?.value !== null ?
        selectedItem.value :
        null

      onChange?.(valueToChange)
    },
  })

  // Обертка для getInputProps с добавлением onBlur
  const getInputProps = useCallback((options?: any) => {
    const inputProps = downshiftGetInputProps(options)

    return {
      ...inputProps,
      onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
        // Вызываем оригинальный onBlur из downshift
        inputProps.onBlur?.(event)
        // Вызываем пользовательский onBlur
        onBlur?.(event)
      },
    }
  }, [downshiftGetInputProps, onBlur])

  return {
    ...combobox,
    selectItem,
    getInputProps,
    setInputValue,
  }
}

/**
 * Хук для floating UI
 */
function useFloatingMenu(isOpen: boolean, loading: boolean) {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen && !loading,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip(),
      shift(),
      sizeMiddleware({
        apply({ rects }: { rects: { reference: { width: number } } }) {
          const floatingElement = refs.floating.current
          if (floatingElement) {
            Object.assign(floatingElement.style, {
              width: `${rects.reference.width}px`,
            })
          }
        },
      }),
    ],
  })

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 200,
  })

  return {
    refs,
    floatingStyles,
    isMounted,
    transitionStyles,
  }
}

/**
 * Провайдер контекста для combobox
 */
interface ComboboxPrimitiveProviderProps<T extends object> extends Pick<
  ComboboxPrimitiveProps<T>,
'size' | 'fullWidth' | 'transparent' | 'disabled' | 'error' | 'placeholder' | 'onChange' | 'onSearch' | 'onBlur'
> {
  children: React.ReactNode
  items: ComboboxPrimitiveItem<T>[]
  value?: T | null
  getLabel: (value: T) => string
  loading?: boolean
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  onClear?: () => void
  clearable?: boolean
}

export function ComboboxPrimitiveProvider<T extends object>({
  children,
  items,
  value: propsValue = null,
  onChange,
  onSearch,
  onBlur,
  size = 'sm',
  fullWidth = true,
  transparent = false,
  disabled = false,
  error,
  placeholder = 'Поиск...',
  getLabel,
  loading = false,
  isOpen,
  onOpenChange,
  onClear,
  clearable,
}: ComboboxPrimitiveProviderProps<T>) {
  const memoizedGetLabel = useCallback(getLabel, [])

  const value = useMemo(() => {
    return propsValue ?
        {
          value: propsValue as T,
          label: memoizedGetLabel(propsValue),
        } as ComboboxPrimitiveItem<T> :
      null
  }, [propsValue, memoizedGetLabel])

  // Основная логика combobox
  const comboboxState = useComboboxPrimitive({
    items,
    value,
    onChange,
    onSearch,
    onBlur,
    disabled,
    getLabel: memoizedGetLabel,
    isOpen,
    onOpenChange,
  })

  // Floating menu логика
  const floatingState = useFloatingMenu(comboboxState.isOpen, loading)

  const contextValue = useMemo<ComboboxPrimitiveContextValue<T>>(() => ({
    // Combobox состояние
    getInputProps: comboboxState.getInputProps,
    getItemProps: comboboxState.getItemProps,
    getMenuProps: comboboxState.getMenuProps,
    getToggleButtonProps: comboboxState.getToggleButtonProps,
    isOpen: comboboxState.isOpen,
    onOpenChange,
    selectedItem: comboboxState.selectedItem,
    setInputValue: comboboxState.setInputValue,
    selectItem: comboboxState.selectItem,

    // Floating UI состояние
    refs: floatingState.refs,
    floatingStyles: floatingState.floatingStyles,
    isMounted: floatingState.isMounted,
    transitionStyles: floatingState.transitionStyles,

    // Пропсы компонента
    size,
    fullWidth,
    transparent,
    disabled,
    error,
    placeholder,
    onBlur,
    loading,
    items,
    getLabel: memoizedGetLabel,
    onClear,
    clearable,
  }), [
    comboboxState,
    floatingState,
    size,
    fullWidth,
    transparent,
    disabled,
    error,
    placeholder,
    onBlur,
    items,
    memoizedGetLabel,
    onOpenChange,
  ])

  return (
    <ComboboxPrimitiveContext.Provider value={contextValue}>
      {children}
    </ComboboxPrimitiveContext.Provider>
  )
}
