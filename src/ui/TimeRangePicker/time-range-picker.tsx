import React from 'react'

import { cn } from '@/lib/utils'

import { Icon } from '../Icon'
import { Typography } from '../Typography'

export interface TimeRange {
  from?: string
  to?: string
}

export interface TimeRangeError {
  from?: string
  to?: string
}

export interface TimeRangePickerProps {
  value?: TimeRange
  onTimeChange?: (timeRange: TimeRange | undefined) => void
  placeholder?: {
    from?: string
    to?: string
  }
  disabled?: boolean
  className?: string
  size?: 'md' | 'lg'
  error?: string | TimeRangeError
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

export function TimeRangePicker({
  value,
  onTimeChange,
  placeholder = {
    from: '00:00',
    to: '00:00',
  },
  disabled = false,
  className,
  size = 'md',
  error,
  caption,
  label,
  onBlur,
  'data-testid': dataTestId,
}: TimeRangePickerProps) {
  const [fromValue, setFromValue] = React.useState(value?.from || '')
  const [toValue, setToValue] = React.useState(value?.to || '')
  const previousFromValueRef = React.useRef<string>(value?.from || '')
  const previousToValueRef = React.useRef<string>(value?.to || '')

  const useTimeRangeError = React.useMemo(() => {
    const isStringError = (
      err: string | TimeRangeError | undefined,
    ): err is string => {
      return typeof err === 'string'
    }

    const isObjectError = (
      err: string | TimeRangeError | undefined,
    ): err is TimeRangeError => {
      return typeof err === 'object' && err !== null
    }

    const hasAnyError = (): boolean => {
      if (!error)
        return false
      if (isStringError(error))
        return true
      return !!(error.from || error.to)
    }

    const hasFromError = (): boolean => {
      if (isStringError(error))
        return true
      return isObjectError(error) && !!error.from
    }

    const hasToError = (): boolean => {
      if (isStringError(error))
        return true
      return isObjectError(error) && !!error.to
    }

    const getErrorText = (): string => {
      if (isStringError(error))
        return error
      if (isObjectError(error)) {
        if (error.from && error.to)
          return `${error.from}, ${error.to}`
        return error.from || error.to || ''
      }
      return ''
    }

    return {
      hasAnyError,
      hasFromError,
      hasToError,
      getErrorText,
    }
  }, [error])

  const { hasAnyError, hasFromError, hasToError, getErrorText } =
    useTimeRangeError

  React.useEffect(() => {
    setFromValue(value?.from || '')
    setToValue(value?.to || '')
    previousFromValueRef.current = value?.from || ''
    previousToValueRef.current = value?.to || ''
  }, [value])

  const formatTimeInput = (inputValue: string, previousValue: string) => {
    // Убираем все кроме цифр
    const numbers = inputValue.replace(/\D/g, '')
    const previousNumbers = previousValue.replace(/\D/g, '')

    const changeType = getChangeType(inputValue, previousValue)

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

  const validateTime = (timeString: string) => {
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

  const updateTimeRange = (from: string, to: string) => {
    const newRange = {
      from: from || undefined,
      to: to || undefined,
    }

    if (!newRange.from && !newRange.to) {
      onTimeChange?.(undefined)
    } else {
      onTimeChange?.(newRange)
    }
  }

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTimeInput(e.target.value, previousFromValueRef.current)

    setFromValue(formatted)
    previousFromValueRef.current = formatted

    if (
      formatted === '' ||
      (formatted.length === 5 && validateTime(formatted))
    ) {
      updateTimeRange(formatted, toValue)
    }
  }

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTimeInput(e.target.value, previousToValueRef.current)

    setToValue(formatted)
    previousToValueRef.current = formatted

    if (
      formatted === '' ||
      (formatted.length === 5 && validateTime(formatted))
    ) {
      updateTimeRange(fromValue, formatted)
    }
  }

  const handleFromBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(event)

    if (fromValue && !validateTime(fromValue)) {
      setFromValue('')
      updateTimeRange('', toValue)
    }
  }

  const handleToBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(event)

    if (toValue && !validateTime(toValue)) {
      setToValue('')
      updateTimeRange(fromValue, '')
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
        <div
          className={cn(
            'font-graphik flex w-full items-center py-1 focus-within:outline-none',
            size === 'md' ? 'rounded-lg' : 'rounded-xl',
            'border-1 focus-within:border-1',
            'enabled:hover:border-1',
            'bg-background w-full pr-10',
            {
              'border-border hover:border-hover-input-primary enabled:hover:border-primary focus-within:border-primary focus-within:shadow-focus':
                !hasAnyError(),
              'border-destructive focus-within:border-destructive enabled:hover:border-destructive focus:shadow-error':
                hasAnyError(),
              'h-8 px-2.5 pt-1.5 pr-2 pb-1.5 text-[14px]': size === 'md',
              'h-10 px-3 pt-2 pr-3 pb-2 text-[16px]': size === 'lg',
              'bg-muted text-muted-foreground cursor-not-allowed': disabled,
            },
          )}
        >
          <input
            type="text"
            value={fromValue}
            onChange={handleFromChange}
            onBlur={handleFromBlur}
            placeholder={placeholder.from}
            disabled={disabled}
            maxLength={5}
            className={cn(
              'font-graphik w-0 flex-1 border-none bg-transparent outline-none',
              'placeholder:text-muted-foreground',
              '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
              hasFromError() && 'text-destructive',
              {
                'h-8 text-[14px]': size === 'md',
                'h-10 text-[16px]': size === 'lg',
                'text-muted-foreground cursor-not-allowed': disabled,
              },
            )}
            data-testid={dataTestId}
          />

          <Icon
            icon="ArrowForwardIcon"
            className="text-muted-foreground mx-1.5 flex-shrink-0"
          />

          <input
            type="text"
            value={toValue}
            onChange={handleToChange}
            onBlur={handleToBlur}
            placeholder={placeholder.to}
            disabled={disabled}
            maxLength={5}
            className={cn(
              'font-graphik w-0 flex-1 border-none bg-transparent outline-none',
              'placeholder:text-muted-foreground',
              '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
              hasToError() && 'text-destructive',
              {
                'h-8 text-[14px]': size === 'md',
                'h-10 text-[16px]': size === 'lg',
                'text-muted-foreground cursor-not-allowed': disabled,
              },
            )}
            data-testid={`${dataTestId}-to`}
          />
        </div>

        <div className="pointer-events-none absolute right-3 flex items-center">
          <Icon icon="TimeIcon" className="text-muted-foreground" />
          {hasAnyError() && (
            <Icon
              icon="ErrorFillIcon"
              className="text-destructive ml-1.5"
              size={16}
            />
          )}
        </div>
      </div>

      {caption && !hasAnyError() && (
        <Typography variant="p1" className="mt-1.5" textColor="secondary">
          {caption}
        </Typography>
      )}
      {hasAnyError() && (
        <Typography variant="p1" className="mt-1.5" textColor="destructive">
          {getErrorText()}
        </Typography>
      )}
    </div>
  )
}
