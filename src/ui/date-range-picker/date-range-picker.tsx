import React from 'react'
import type { DateRange } from 'react-day-picker'

import type { Locale } from 'date-fns'

import { format } from 'date-fns'
import { enUS, ru } from 'date-fns/locale'

import type { ButtonSize } from '../button'
import { Button } from '../button'
import { Calendar } from '../Calendar'
import { DialogBase } from '../Dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../Popover'
import { Typography } from '../Typography'
import { cn } from '@/lib/utils'
import { useDeviceDetector } from '@/utils/use-device-detector'

import { Icon } from '../Icon'
import { translations } from './constants'
import * as customLocales from './locales'

type DateRangePickerSize = Exclude<ButtonSize, 'sm'>

interface CalendarDateAfter {
  after: Date
}
interface CalendarDateBefore {
  before: Date
}
interface CalendarDateInterval {
  before: Date
  after: Date
}
interface CalendarDateRange {
  from: Date | undefined
  to?: Date | undefined
}
interface CalendarDayOfWeek {
  dayOfWeek: number[]
}
type CalendarDisabledMatcher =
  | boolean
  | ((date: Date) => boolean)
  | Date
  | Date[]
  | CalendarDateRange
  | CalendarDateBefore
  | CalendarDateAfter
  | CalendarDateInterval
  | CalendarDayOfWeek

export interface DateRangeError {
  from?: string
  to?: string
}

export interface DateRangePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'onDateChange'> {
  value?: DateRange
  size?: DateRangePickerSize
  onDateChange?: (date: DateRange | undefined) => void
  placeholder?: {
    from?: string
    to?: string
  }
  disabled?: boolean
  error?: string | DateRangeError
  caption?: string
  label?: string
  showResetButton?: boolean
  onReset?: () => void
  locale?: 'ru' | 'en' | 'uz' | 'tg'
  'data-testid'?: string
  disabledDays?: CalendarDisabledMatcher | CalendarDisabledMatcher[]
}

function getDateFnsLocale(locale: 'ru' | 'en' | 'uz' | 'tg'): Locale {
  switch (locale) {
    case 'en':
      return enUS
    case 'uz':
      return customLocales.uz
    case 'tg':
      return customLocales.tg
    case 'ru':
    default:
      return ru
  }
}

export function DateRangePicker({
  className,
  value,
  locale = 'ru',
  onDateChange,
  placeholder,
  error,
  caption,
  label,
  size = 'md',
  disabled = false,
  showResetButton = true,
  onReset,
  disabledDays,
  'data-testid': dataTestId,
  ...props
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const device = useDeviceDetector()
  const t = translations[locale]
  const dateFnsLocale = getDateFnsLocale(locale)
  const defaultPlaceholder = {
    from: placeholder?.from || t.placeholder,
    to: placeholder?.to || t.placeholder,
  }

  const useDateRangeError = React.useMemo(() => {
    const isStringError = (
      err: string | DateRangeError | undefined,
    ): err is string => {
      return typeof err === 'string'
    }

    const isObjectError = (
      err: string | DateRangeError | undefined,
    ): err is DateRangeError => {
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
    useDateRangeError

  React.useEffect(() => {
    setDate(value)
  }, [value])

  const handleSelect = (newDate: DateRange | undefined) => {
    setDate(newDate)
    onDateChange?.(newDate)
    if (newDate?.from && newDate?.to && device === 'mobile') {
      setIsDialogOpen(false)
    }
  }

  const handleReset = () => {
    setDate(undefined)
    onDateChange?.(undefined)
    onReset?.()
  }

  const getBorderRadius = () => {
    switch (size) {
      case 'md':
        return 'rounded-lg'
      case 'lg':
        return 'rounded-xl'
      default:
        return 'rounded-lg'
    }
  }

  return (
    <div className={className} {...props}>
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

      {device === 'mobile' ?
          (
            <DialogBase
              open={isDialogOpen}
              onOpenChange={!disabled ? setIsDialogOpen : undefined}
              width="md"
              trigger={(
                <Button
                  variant="dashed"
                  disabled={disabled}
                  size={size}
                  iconPosition="end"
                  className={cn(
                    'group border-border font-graphik w-full justify-start border-1 border-solid text-left text-[16px] leading-[22px]',
                    getBorderRadius(),
                    size === 'lg' ? 'px-3' : 'px-2.5',
                    hasAnyError() ? 'hover:text-destructive' : '',
                    {
                      'shadow-focus border-primary border-1 border-solid':
                        isDialogOpen,
                    },
                    {
                      'shadow-error border-destructive border-1 border-solid':
                        hasAnyError() && isDialogOpen,
                    },
                    {
                      'bg-background placeholder:text-muted-foreground disabled:bg-input-disabled-background border-destructive focus:border-destructive enabled:hover:border-destructive':
                        hasAnyError(),
                    },
                  )}
                  data-testid={dataTestId}
                >
                  <div className="flex w-full items-center">
                    <div
                      className={cn(
                        'flex w-full items-center justify-between',
                        date ? 'text-foreground' : 'text-muted-foreground',
                        isDialogOpen && !disabled && '!text-default',
                      )}
                    >
                      <div
                        className={cn(
                          'flex-1 text-left',
                          hasFromError() && 'text-destructive',
                        )}
                      >
                        {date?.from ?
                            (
                              format(date.from, 'dd.MM.yyyy', {
                                locale: dateFnsLocale,
                              })
                            ) :
                            (
                              <span className={cn(disabled && 'text-muted-foreground')}>{defaultPlaceholder.from}</span>
                            )}
                      </div>
                      <Icon icon="ArrowForwardIcon" className="mx-1.5" />
                      <div
                        className={cn(
                          'flex-1 text-left',
                          hasToError() && 'text-destructive',
                        )}
                      >
                        {date?.to ?
                            (
                              format(date.to, 'dd.MM.yyyy', {
                                locale: dateFnsLocale,
                              })
                            ) :
                            (
                              <span className={cn(disabled && 'text-muted-foreground')}>{defaultPlaceholder.to}</span>
                            )}
                      </div>
                    </div>
                    <div className="ml-2 flex items-center gap-1.5">
                      <Icon
                        className={cn(
                          'group-focus-within:text-foreground text-muted-foreground transition-colors',
                          disabled && 'text-muted-foreground',
                          isDialogOpen && !disabled && !hasAnyError() && '!text-default',
                          date && (date.from || date.to) && !disabled && !hasAnyError() && 'text-default',
                          hasAnyError() &&
                          '!group-focus-within:!text-destructive !text-destructive',
                        )}
                        icon="CalendarIcon"
                        size={16}
                      />
                      {hasAnyError() && (
                        <Icon
                          icon="ErrorFillIcon"
                          className="text-destructive"
                          size={16}
                        />
                      )}
                    </div>
                  </div>
                </Button>
              )}
              classNames={{
                title: 'm-0 p-0 text-left font-graphik',
              }}
            >
              <DialogBase.Title>{t.selectPeriod}</DialogBase.Title>

              <DialogBase.Content>
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  className="mt-3"
                  onSelect={handleSelect}
                  numberOfMonths={1}
                  locale={dateFnsLocale}
                  disabled={disabledDays}
                />
              </DialogBase.Content>

              {showResetButton && (
                <DialogBase.Footer>
                  <div className="flex h-[44px] w-full items-center justify-center">
                    <Button
                      onClick={handleReset}
                      variant="text"
                      className="w-full"
                      disabled={!date?.from && !date?.to}
                    >
                      {t.reset}
                    </Button>
                  </div>
                </DialogBase.Footer>
              )}
            </DialogBase>
          ) :
          (
            <Popover open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="dashed"
                  disabled={disabled}
                  size={size}
                  iconPosition="end"
                  className={cn(
                    'group border-border font-graphik w-full justify-start border-1 border-solid text-left text-[16px] leading-[22px]',
                    getBorderRadius(),
                    size === 'lg' ? 'px-3' : 'px-2.5',
                    hasAnyError() ? 'hover:text-destructive' : '',
                    {
                      'shadow-focus border-primary border-1 border-solid':
                    isDialogOpen,
                    },
                    {
                      'shadow-error border-destructive border-1 border-solid':
                    hasAnyError() && isDialogOpen,
                    },
                    {
                      'bg-background placeholder:text-muted-foreground disabled:bg-input-disabled-background border-destructive focus:border-destructive enabled:hover:border-destructive':
                    hasAnyError(),
                    },
                  )}
                  data-testid={dataTestId}
                >
                  <div className="flex w-full items-center">
                    <div
                      className={cn(
                        'flex w-full items-center justify-between',
                        date ? 'text-foreground' : 'text-muted-foreground',
                        isDialogOpen && !disabled && '!text-default',
                      )}
                    >
                      <div
                        className={cn(
                          'flex-1 text-left',
                          hasFromError() && 'text-destructive',
                          disabled && 'text-muted-foreground',
                        )}
                      >
                        {date?.from ?
                            (
                              format(date.from, 'dd.MM.yyyy', {
                                locale: dateFnsLocale,
                              })
                            ) :
                            (
                              <span className={cn(disabled && 'text-muted-foreground')}>{defaultPlaceholder.from}</span>
                            )}
                      </div>
                      <Icon icon="ArrowForwardIcon" className={cn('mx-1.5', disabled && 'text-muted-foreground')} />
                      <div
                        className={cn(
                          'flex-1 text-left',
                          hasToError() && 'text-destructive',
                          disabled && 'text-muted-foreground',
                        )}
                      >
                        {date?.to ?
                            (
                              format(date.to, 'dd.MM.yyyy', {
                                locale: dateFnsLocale,
                              })
                            ) :
                            (
                              <span className={cn(disabled && 'text-muted-foreground')}>{defaultPlaceholder.to}</span>
                            )}
                      </div>
                    </div>
                    <div className="ml-2 flex items-center gap-1.5">
                      <Icon
                        className={cn(
                          'group-focus-within:text-foreground text-muted-foreground transition-colors',
                          disabled && 'text-muted-foreground',
                          isDialogOpen && !disabled && !hasAnyError() && '!text-default',
                          date && (date.from || date.to) && !disabled && !hasAnyError() && 'text-default',
                          hasAnyError() &&
                          '!group-focus-within:!text-destructive !text-destructive',
                        )}
                        icon="CalendarIcon"
                        size={16}
                      />
                      {hasAnyError() && (
                        <Icon
                          icon="ErrorFillIcon"
                          className="text-destructive"
                          size={16}
                        />
                      )}
                    </div>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-screen rounded-xl p-0 shadow-[0_2px_10px_rgba(0,0,0,0.1)] sm:w-auto"
                align="start"
                sideOffset={4}
              >
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleSelect}
                  numberOfMonths={2}
                  locale={dateFnsLocale}
                  disabled={disabledDays}
                />
                {showResetButton && (
                  <div className="flex h-11 items-center justify-center px-2.5 py-2.5">
                    <Button
                      onClick={handleReset}
                      variant="text"
                      size="sm"
                      className="w-full"
                      disabled={!date?.from && !date?.to}
                    >
                      {t.reset}
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )}

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
