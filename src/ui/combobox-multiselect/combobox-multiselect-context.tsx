import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react'

import type { ComboboxPrimitiveItem, ComboboxPrimitiveProps } from '../combobox-primitive/types'

import { autoUpdate, flip, offset, shift, size as sizeMiddleware, useFloating, useTransitionStyles } from '@floating-ui/react'
import { useCombobox } from 'downshift'

/**
 * Контекст для состояния combobox
 */
interface ComboboxMultiSelectContextValue<T extends object> {
  // Combobox состояние
  getInputProps: ReturnType<typeof useCombobox>['getInputProps']
  getItemProps: ReturnType<typeof useCombobox>['getItemProps']
  getMenuProps: ReturnType<typeof useCombobox>['getMenuProps']
  getToggleButtonProps: ReturnType<typeof useCombobox>['getToggleButtonProps']
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  selectedItem: ComboboxPrimitiveItem<T> | null
  setInputValue: ReturnType<typeof useCombobox>['setInputValue']
  isItemSelected?: (option: T) => boolean
  hasSelection?: boolean

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

const ComboboxMultiSelectContext = createContext<ComboboxMultiSelectContextValue<any> | null>(null)

/**
 * Хук для получения контекста combobox
 */
export function useComboboxMultiSelectContext<T extends object>(): ComboboxMultiSelectContextValue<T> {
  const context = useContext(ComboboxMultiSelectContext)
  if (!context) {
    throw new Error('useComboboxMultiSelectContext must be used within ComboboxMultiSelectProvider')
  }
  return context
}

/**
 * Хук для работы с combobox логикой
 */
function useComboboxMultiSelect<T>({
  items,
  value = null,
  onChange,
  onSearch,
  onBlur,
  disabled,
  getLabel,
  isOpen,
  onOpenChange,
  inputValue,
  keepOpenOnSelect,
  inputValueOnSelect,
  inputValueOnClose,
}: {
  items: ComboboxPrimitiveItem<T>[]
  onChange?: (value: T | null) => void
  onSearch?: (value: string) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  disabled: boolean
  value?: any | null | undefined
  getLabel: (value: T) => string
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  inputValue?: string
  keepOpenOnSelect?: boolean
  inputValueOnSelect?: 'selectedLabel' | 'clear' | 'preserve'
  inputValueOnClose?: 'selectedLabel' | 'clear' | 'preserve'
}) {
  const setInputValueRef = useRef<((nextValue: string) => void) | null>(null)

  // stateReducer для контроля изменений состояния downshift
  const stateReducer = useCallback((_state: any, actionAndChanges: any) => {
    const { type, changes } = actionAndChanges

    switch (type) {
      case useCombobox.stateChangeTypes.ItemClick:
      case useCombobox.stateChangeTypes.InputKeyDownEnter:
      case useCombobox.stateChangeTypes.FunctionSelectItem:
        // При выборе элемента можно управлять:
        // - закрытием меню
        // - тем, что попадает в inputValue
        return {
          ...changes,
          isOpen: keepOpenOnSelect ? true : changes.isOpen,
          inputValue:
            inputValueOnSelect === 'clear' ?
              '' :
              inputValueOnSelect === 'preserve' ?
                  (_state?.inputValue || '') :
                  (changes.selectedItem ? getLabel(changes.selectedItem.value) : (changes.inputValue || '')),
        }
      case useCombobox.stateChangeTypes.InputKeyDownEscape:
      case useCombobox.stateChangeTypes.InputBlur:
        return {
          ...changes,
          inputValue:
            inputValueOnClose === 'clear' ?
              '' :
              inputValueOnClose === 'preserve' ?
                  (_state?.inputValue || '') :
                  (changes.selectedItem ? getLabel(changes.selectedItem.value) : (changes.inputValue || '')),
        }
      default:
        return changes
    }
  }, [getLabel, inputValueOnSelect, inputValueOnClose, keepOpenOnSelect])

  const comboboxOptions: any = {
    items,
    stateReducer,
    isOpen,
    onIsOpenChange: (state: any) => {
      onOpenChange?.(state.isOpen)

      if (!state.isOpen) {
        if (inputValueOnClose === 'preserve') {
          return
        }

        setInputValueRef.current?.(
          inputValueOnClose === 'clear' ?
            '' :
              (state.selectedItem ? getLabel(state.selectedItem.value) : ''),
        )
      }
    },
    itemToString: (item: any) => {
      return item ? getLabel(item?.value) : ''
    },
    onInputValueChange: ({ inputValue, type }: any) => {
      if (disabled) {
        return
      }

      // Вызываем onSearch только при реальном вводе в поле.
      // Downshift может дергать onInputValueChange на внутренних событиях (например, при движении мыши),
      // и там inputValue может быть undefined/пустым — это не должно затирать введённый текст.
      if (type === useCombobox.stateChangeTypes.InputChange) {
        onSearch?.(inputValue ?? '')
      }
    },
    onSelectedItemChange: ({ selectedItem }: any) => {
      if (disabled) {
        return
      }

      const valueToChange = selectedItem?.value !== undefined && selectedItem?.value !== null ?
        selectedItem.value :
        null

      onChange?.(valueToChange)
    },
  }

  // Если value === undefined — делаем selectedItem uncontrolled (для мультиселекта)
  if (value !== undefined) {
    comboboxOptions.selectedItem = value
  }

  // Если inputValue задан — делаем inputValue controlled
  if (inputValue !== undefined) {
    comboboxOptions.inputValue = inputValue
  }

  const { selectItem, setInputValue, getInputProps: downshiftGetInputProps, ...combobox } = useCombobox(comboboxOptions)
  setInputValueRef.current = setInputValue

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
interface ComboboxMultiSelectProviderProps<T extends object> extends Pick<
  ComboboxPrimitiveProps<T>,
  'size'
  | 'fullWidth'
  | 'transparent'
  | 'disabled'
  | 'error'
  | 'placeholder'
  | 'onChange'
  | 'onSearch'
  | 'onBlur'
  | 'inputValue'
  | 'keepOpenOnSelect'
  | 'inputValueOnSelect'
  | 'inputValueOnClose'
  | 'isItemSelected'
  | 'hasSelection'
> {
  children: React.ReactNode
  items: ComboboxPrimitiveItem<T>[]
  value?: T | null | undefined
  getLabel: (value: T) => string
  loading?: boolean
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  onClear?: () => void
  clearable?: boolean
}

export function ComboboxMultiSelectProvider<T extends object>({
  children,
  items,
  value: propsValue,
  onChange,
  onSearch,
  onBlur,
  inputValue,
  keepOpenOnSelect,
  inputValueOnSelect = 'selectedLabel',
  inputValueOnClose = 'selectedLabel',
  isItemSelected,
  hasSelection,
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
}: ComboboxMultiSelectProviderProps<T>) {
  const memoizedGetLabel = useCallback(getLabel, [getLabel])

  const value = useMemo<ComboboxPrimitiveItem<T> | null | undefined>(() => {
    if (propsValue === undefined) {
      return undefined
    }
    if (propsValue === null) {
      return null
    }
    return {
      value: propsValue as T,
      label: memoizedGetLabel(propsValue),
    } as ComboboxPrimitiveItem<T>
  }, [propsValue, memoizedGetLabel])

  // Основная логика combobox
  const comboboxState = useComboboxMultiSelect({
    items,
    value,
    onChange,
    onSearch,
    onBlur,
    disabled,
    getLabel: memoizedGetLabel,
    isOpen,
    onOpenChange,
    inputValue,
    keepOpenOnSelect,
    inputValueOnSelect,
    inputValueOnClose,
  })

  // Floating menu логика
  const floatingState = useFloatingMenu(comboboxState.isOpen, loading)

  const contextValue = useMemo<ComboboxMultiSelectContextValue<T>>(() => ({
    // Combobox состояние
    getInputProps: comboboxState.getInputProps,
    getItemProps: comboboxState.getItemProps,
    getMenuProps: comboboxState.getMenuProps,
    getToggleButtonProps: comboboxState.getToggleButtonProps,
    isOpen: comboboxState.isOpen,
    onOpenChange,
    selectedItem: comboboxState.selectedItem as ComboboxPrimitiveItem<T> | null,
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
    isItemSelected,
    hasSelection,
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
    onClear,
    clearable,
    isItemSelected,
    hasSelection,
  ])

  return (
    <ComboboxMultiSelectContext.Provider value={contextValue}>
      {children}
    </ComboboxMultiSelectContext.Provider>
  )
}
