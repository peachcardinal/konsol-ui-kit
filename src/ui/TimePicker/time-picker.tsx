import React from 'react'

import { cn } from '@/lib/utils'

import { Icon } from '../Icon'
import { Typography } from '../Typography'

export interface TimePickerProps {
  time?: string | undefined
  onSelect?: (time: string | undefined) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  size?: 'md' | 'lg'
  error?: string
  caption?: string
  label?: string
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  'data-testid'?: string
}

function getChangeType(currentValue: string, previousValue: string): 'added' | 'removed' | 'unchanged' {
  if (currentValue === previousValue) {
    return 'unchanged'
  }

  if (currentValue.length > previousValue.length) {
    return 'added'
  }

  if (currentValue.length < previousValue.length) {
    return 'removed'
  }

  return 'added'
}

function formatTimeInput(value: string, previousValue: string) {
  // Убираем все кроме цифр
  const numbers = value.replace(/\D/g, '')
  const previousNumbers = previousValue.replace(/\D/g, '')

  const changeType = getChangeType(value, previousValue)

  if (numbers.length === 0) {
    return ''
  }

  // Если удаляем из "12:3" → должно остаться "12:"
  if (changeType === 'removed' && numbers.length === 2 && previousNumbers.length === 3) {
    return `${numbers}:`
  }

  // Если удаляем двоеточие (осталось 2 цифры, но количество цифр не изменилось)
  // previousValue имело "12:", value стало "12" → возвращаем только первую цифру "1"
  if (changeType === 'removed' && numbers.length === 2 && previousNumbers.length === 2 && previousValue.includes(':')) {
    return numbers[0]
  }

  // Если удаляем и остается 1 цифра - возвращаем без двоеточия
  if (changeType === 'removed' && numbers.length === 1) {
    return numbers
  }

  // Если добавляем и есть ровно 2 цифры - автоматически добавляем двоеточие
  if (changeType === 'added' && numbers.length === 2 && previousNumbers.length === 1) {
    return `${numbers}:`
  }

  // Если есть 1 цифра - возвращаем как есть
  if (numbers.length === 1) {
    return numbers
  }

  // Если есть 2 цифры и это не автодобавление - возвращаем как есть
  if (numbers.length === 2) {
    return numbers
  }

  // Если 3-4 цифры - форматируем с двоеточием
  if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}:${numbers.slice(2)}`
  }

  return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`
}

function validateTime(timeString: string) {
  if (!timeString) {
    return true
  }

  const timeRegex = /^(?:[01]?\d|2[0-3]):[0-5]?\d$/
  if (!timeRegex.test(timeString)) {
    return false
  }

  const [hours, minutes] = timeString.split(':').map(Number)
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
}

export function TimePicker({
  time,
  onSelect,
  disabled = false,
  placeholder = '00:00',
  className,
  size = 'md',
  error,
  caption,
  label,
  onBlur,
  'data-testid': dataTestId,
}: TimePickerProps) {
  const [inputValue, setInputValue] = React.useState(time || '')
  const previousValueRef = React.useRef<string>(time || '')

  React.useEffect(() => {
    setInputValue(time || '')
    previousValueRef.current = time || ''
  }, [time])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTimeInput(e.target.value, previousValueRef.current)

    setInputValue(formatted)
    previousValueRef.current = formatted

    if (formatted.length === 5 && validateTime(formatted)) {
      onSelect?.(formatted)
    } else if (formatted === '') {
      onSelect?.(undefined)
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(event)

    if (inputValue && !validateTime(inputValue)) {
      setInputValue('')
      onSelect?.(undefined)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <Typography
          variant="p3"
          weight="medium"
          className={cn('mb-1.5', {
            'text-[14px]': size === 'md',
            'text-[16px]': size === 'lg',
          })}
        >
          {label}
        </Typography>
      )}

      <div className="relative flex w-full items-center">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={5}
          className={cn(
            'focus:shadow-focus font-graphik flex rounded-md py-1 focus:outline-none disabled:cursor-not-allowed',
            size === 'md' ? 'rounded-lg' : 'rounded-xl',
            'border-1 focus:border-1',
            'enabled:hover:border-1',
            '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
            'bg-background placeholder:text-muted-foreground w-full pr-8',
            {
              'border-border enabled:hover:border-hover-input-primary focus:border-primary':
                error === undefined || error === null,
              'border-destructive focus:border-destructive enabled:hover:border-destructive focus:shadow-error':
                error !== undefined && error !== null,
              'h-8 px-2.5 pt-1.5 pb-1.5 text-[14px]': size === 'md',
              'h-10 px-3 pt-1.5 pb-1.5 text-[16px]': size === 'lg',
              'bg-muted text-muted-foreground placeholder:text-muted-foreground cursor-not-allowed':
                disabled,
            },
          )}
          data-testid={dataTestId}
        />

        <div className="pointer-events-none absolute right-3 flex items-center">
          <Icon icon="TimeIcon" className="text-muted-foreground" />
          {error && (
            <Icon
              icon="ErrorFillIcon"
              className="text-destructive ml-1.5"
              size={16}
            />
          )}
        </div>
      </div>

      {caption && !error && (
        <Typography variant="p1" className="mt-1.5" textColor="secondary">
          {caption}
        </Typography>
      )}
      {error && (
        <Typography variant="p1" className="mt-1.5" textColor="destructive">
          {error}
        </Typography>
      )}
    </div>
  )
}
