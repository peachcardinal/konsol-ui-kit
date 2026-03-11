import React, { useCallback, useState } from 'react'

import type { ComponentPropsWithoutRef } from 'react'

import { Input } from '../Input'

type InputProps = ComponentPropsWithoutRef<typeof Input>

export type InputNumberProps = Omit<InputProps, 'type' | 'value' | 'onChange'> & {
  /** Значение числа */
  value?: number | string
  /** Обработчик изменения значения */
  onChange?: (value: number | string) => void
  /** Количество цифр после запятой (по умолчанию неограниченно) */
  decimalPlaces?: number
  /** Разделитель для десятичной части ('comma' | 'dot') */
  separator?: 'comma' | 'dot'
  /** Функция трансформации значения перед отображением */
  transformer?: (value: string) => string
  /** Минимальное значение */
  min?: number
  /** Максимальное значение */
  max?: number
  /** Разрешить отрицательные числа */
  allowNegative?: boolean
  /** Разрешить пустое значение */
  allowEmpty?: boolean
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      value,
      onChange,
      decimalPlaces,
      separator = 'dot',
      transformer,
      min,
      max,
      allowNegative = true,
      allowEmpty = true,
      onKeyDown,
      onPaste,
      onClear,
      ...props
    },
    ref,
  ) => {
    const [displayValue, setDisplayValue] = useState<string>(() => {
      if (value === undefined || value === null || value === '') {
        return ''
      }
      return String(value)
    })

    // Функция для нормализации разделителя
    const normalizeSeparator = useCallback(
      (str: string) => {
        if (separator === 'comma') {
          return str.replace(/\./g, ',')
        } else {
          return str.replace(/,/g, '.')
        }
      },
      [separator],
    )

    // Функция для валидации и форматирования ввода
    const validateAndFormat = useCallback(
      (inputValue: string): string => {
        if (inputValue === '' && allowEmpty) {
          return ''
        }

        // Удаляем все символы кроме цифр, разделителей и знака минус
        let cleaned = inputValue.replace(/[^\d.,\-]/g, '')

        // Проверяем знак минус
        if (!allowNegative) {
          cleaned = cleaned.replace(/-/g, '')
        } else {
          // Знак минус может быть только в начале
          const minusCount = (cleaned.match(/-/g) || []).length
          if (minusCount > 1) {
            cleaned = cleaned.replace(/-/g, '')
            if (inputValue.startsWith('-')) {
              cleaned = `-${cleaned}`
            }
          }
        }

        // Нормализуем разделитель
        cleaned = normalizeSeparator(cleaned)

        // Проверяем количество разделителей (должен быть только один)
        const separatorCount = (cleaned.match(/[.,]/g) || []).length
        if (separatorCount > 1) {
          // Оставляем только первый разделитель
          const firstSeparatorIndex = cleaned.search(/[.,]/)
          cleaned =
            cleaned.substring(0, firstSeparatorIndex + 1) +
            cleaned.substring(firstSeparatorIndex + 1).replace(/[.,]/g, '')
        }

        // Ограничиваем количество цифр после запятой
        if (decimalPlaces !== undefined && decimalPlaces >= 0) {
          const separatorIndex = cleaned.search(/[.,]/)
          if (separatorIndex !== -1) {
            const beforeSeparator = cleaned.substring(0, separatorIndex)
            const afterSeparator = cleaned.substring(separatorIndex + 1)
            const limitedAfterSeparator = afterSeparator.substring(0, decimalPlaces)
            cleaned = beforeSeparator + cleaned[separatorIndex] + limitedAfterSeparator
          }
        }

        // Применяем трансформатор если он есть
        if (transformer) {
          cleaned = transformer(cleaned)
        }

        return cleaned
      },
      [decimalPlaces, separator, allowNegative, allowEmpty, normalizeSeparator, transformer],
    )

    // Функция для проверки ограничений min/max
    const validateRange = useCallback(
      (numValue: number): boolean => {
        if (min !== undefined && numValue < min) {
          return false
        }
        if (max !== undefined && numValue > max) {
          return false
        }
        return true
      },
      [min, max],
    )

    // Обработчик изменения значения
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value
        const formattedValue = validateAndFormat(inputValue)

        setDisplayValue(formattedValue)

        // Преобразуем в число для вызова onChange
        if (formattedValue === '') {
          onChange?.(allowEmpty ? '' : 0)
          return
        }

        // Заменяем разделитель на точку для корректного парсинга числа
        const normalizedValue = separator === 'comma' ?
            formattedValue.replace(/,/g, '.') :
          formattedValue

        const numValue = Number.parseFloat(normalizedValue)

        if (!Number.isNaN(numValue)) {
          if (validateRange(numValue)) {
            onChange?.(numValue)
          } else {
            // Если значение не проходит проверку диапазона,
            // все равно обновляем отображение, но не вызываем onChange
            onChange?.(formattedValue)
          }
        } else {
          onChange?.(formattedValue)
        }
      },
      [validateAndFormat, validateRange, onChange, separator, allowEmpty],
    )

    // Обработчик нажатия клавиш
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        const { key, ctrlKey, metaKey } = event

        // Разрешаем служебные клавиши
        if (
          ctrlKey ||
          metaKey ||
          [
            'Backspace',
            'Delete',
            'Tab',
            'Escape',
            'Enter',
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown',
            'Home',
            'End',
          ].includes(key)
        ) {
          onKeyDown?.(event)
          return
        }

        // Разрешаем цифры
        if (/^\d$/.test(key)) {
          onKeyDown?.(event)
          return
        }

        // Разрешаем разделители
        if (key === '.' || key === ',') {
          // Проверяем, что разделитель разрешен для текущего separator
          if ((separator === 'dot' && key === '.') || (separator === 'comma' && key === ',')) {
            onKeyDown?.(event)
            return
          }
          // Если введен неправильный разделитель, заменяем его на правильный
          event.preventDefault()
          const input = event.currentTarget
          const cursorPosition = input.selectionStart || 0
          const newValue = input.value.substring(0, cursorPosition) + (separator === 'dot' ? '.' : ',') + input.value.substring(cursorPosition)
          const formattedValue = validateAndFormat(newValue)
          setDisplayValue(formattedValue)
          onChange?.(formattedValue)
          return
        }

        // Разрешаем знак минус в начале
        if (key === '-' && allowNegative) {
          const input = event.currentTarget
          const cursorPosition = input.selectionStart || 0
          if (cursorPosition === 0 && !input.value.includes('-')) {
            onKeyDown?.(event)
            return
          }
        }

        // Блокируем все остальные символы
        event.preventDefault()
      },
      [allowNegative, onKeyDown, separator, validateAndFormat, setDisplayValue, onChange],
    )

    // Обработчик вставки
    const handlePaste = useCallback(
      (event: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedText = event.clipboardData.getData('text')
        const formattedText = validateAndFormat(pastedText)

        if (formattedText !== pastedText) {
          event.preventDefault()
          const input = event.currentTarget
          const start = input.selectionStart || 0
          const end = input.selectionEnd || 0
          const newValue = input.value.substring(0, start) + formattedText + input.value.substring(end)
          const finalValue = validateAndFormat(newValue)

          setDisplayValue(finalValue)
          onChange?.(finalValue)
        }

        onPaste?.(event)
      },
      [validateAndFormat, onChange, onPaste],
    )

    // Синхронизируем displayValue с внешним value
    React.useEffect(() => {
      if (value !== undefined && value !== null) {
        const stringValue = String(value)
        if (stringValue !== displayValue) {
          setDisplayValue(stringValue)
        }
      }
    }, [value, displayValue])

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onClear={onClear}
        inputMode="decimal"
      />
    )
  },
)

InputNumber.displayName = 'InputNumber'

export { InputNumber }
