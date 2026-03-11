import React from 'react'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

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

type DatePickerSize = Exclude<ButtonSize, 'sm'>

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

export interface DatePickerProps {
  date?: Date | undefined
  onSelect?: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  size?: DatePickerSize
  error?: string
  caption?: string
  label?: string
  showResetButton?: boolean
  onReset?: () => void
  disabledDays?: CalendarDisabledMatcher | CalendarDisabledMatcher[]
  'data-testid'?: string
}

export function DatePicker({
  date,
  onSelect,
  disabled = false,
  placeholder = 'дд.мм.гггг',
  className,
  size = 'md',
  error,
  caption,
  label,
  showResetButton = true,
  onReset,
  disabledDays,
  'data-testid': dataTestId,
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
  const device = useDeviceDetector()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  React.useEffect(() => {
    if (date !== selectedDate) {
      setSelectedDate(date)
    }
  }, [date])

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedDate(newDate)
      onSelect?.(newDate)
      if (device === 'mobile') {
        setIsDialogOpen(false)
      }
    }
  }

  const handleReset = () => {
    setSelectedDate(undefined)
    onSelect?.(undefined)
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
    <div className={className}>
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
              hideFooter={!showResetButton}
              trigger={(
                <Button
                  variant="dashed"
                  disabled={disabled}
                  size={size}
                  iconPosition="end"
                  className={cn(
                    'group border-border font-graphik w-full justify-start border-1 border-solid text-left text-[16px] leading-[22px]',
                    size === 'lg' ? 'px-3' : 'px-2.5',
                    getBorderRadius(),
                    {
                      'shadow-focus border-primary border-1 border-solid':
                        isDialogOpen,
                    },
                    {
                      'shadow-error border-destructive border-1 border-solid':
                        error !== undefined && error !== null && isDialogOpen,
                    },
                    {
                      'bg-background placeholder:text-muted-foreground disabled:bg-input-disabled-background border-destructive focus:border-destructive enabled:hover:border-destructive':
                        error !== undefined && error !== null,
                    },
                    error !== undefined && error !== null ?
                      'hover:text-destructive' :
                      '',
                  )}
                  data-testid={dataTestId}
                >
                  <div className="flex w-full items-center">
                    <div
                      className={cn(
                        'flex-1',
                        selectedDate ? 'text-foreground' : 'text-muted-foreground',
                        disabled && 'text-muted-foreground',
                        isDialogOpen && !disabled && '!text-default',
                      )}
                    >
                      {selectedDate ?
                          format(selectedDate, 'dd.MM.yyyy', { locale: ru }) :
                        placeholder}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon
                        className={cn(
                          'group-focus-within:text-foreground text-muted-foreground transition-colors',
                          disabled && 'text-muted-foreground',
                          isDialogOpen && !disabled && !(error !== undefined && error !== null) && '!text-default',
                          selectedDate && !disabled && !(error !== undefined && error !== null) && 'text-default',
                          error !== undefined && error !== null &&
                          '!group-focus-within:!text-destructive !text-destructive',
                        )}
                        icon="CalendarIcon"
                        size={16}
                      />
                      {error && (
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
                title: 'm-0 mb-5 p-0 text-left font-graphik',
              }}
            >
              <DialogBase.Title>Выберите дату</DialogBase.Title>

              <DialogBase.Content>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleSelect}
                  initialFocus
                  locale={ru}
                  className="font-graphik mt-3"
                  numberOfMonths={1}
                  disabled={disabledDays}
                />
              </DialogBase.Content>

              {showResetButton && (
                <DialogBase.Footer>
                  <div className="flex h-[64px] w-full items-center justify-center">
                    <Button
                      onClick={handleReset}
                      variant="text"
                      disabled={!selectedDate}
                      className="w-full"
                    >
                      Сбросить
                    </Button>
                  </div>
                </DialogBase.Footer>
              )}
            </DialogBase>
          ) :
          (
            <Popover
              open={isDialogOpen}
              onOpenChange={!disabled ? setIsDialogOpen : undefined}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="dashed"
                  disabled={disabled}
                  iconPosition="end"
                  size={size}
                  className={cn(
                    'group border-border font-graphik w-full justify-start border-1 border-solid text-left text-[16px] leading-[22px]',
                    getBorderRadius(),
                    size === 'lg' ? 'px-3' : 'px-2.5',
                    {
                      'shadow-focus border-primary border-1 border-solid':
                    isDialogOpen,
                    },
                    {
                      'shadow-error border-destructive border-1 border-solid':
                    error !== undefined && error !== null && isDialogOpen,
                    },
                    {
                      'bg-background placeholder:text-muted-foreground disabled:bg-input-disabled-background border-destructive focus:border-destructive enabled:hover:border-destructive':
                    error !== undefined && error !== null,
                    },
                    error !== undefined && error !== null ?
                      'hover:text-destructive' :
                      '',
                  )}
                  data-testid={dataTestId}
                >
                  <div className="flex w-full items-center">
                    <div
                      className={cn(
                        'flex-1',
                        selectedDate ? 'text-foreground' : 'text-muted-foreground',
                        isDialogOpen && !disabled && '!text-default',
                      )}
                    >
                      {selectedDate ?
                          format(selectedDate, 'dd.MM.yyyy', { locale: ru }) :
                        placeholder}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon
                        className={cn(
                          'group-focus-within:text-foreground text-muted-foreground transition-colors',
                          disabled && 'text-muted-foreground',
                          isDialogOpen && !disabled && !(error !== undefined && error !== null) && '!text-default',
                          selectedDate && !disabled && !(error !== undefined && error !== null) && 'text-default',
                          error !== undefined && error !== null &&
                          '!group-focus-within:!text-destructive !text-destructive',
                        )}
                        icon="CalendarIcon"
                        size={16}
                      />
                      {error && (
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
                className="w-auto rounded-xl p-0 shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
                align="start"
                sideOffset={4}
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleSelect}
                  initialFocus
                  locale={ru}
                  className="font-graphik"
                  disabled={disabledDays}
                />
                {showResetButton && (
                  <div className="flex h-11 items-center justify-center px-2.5 py-2.5">
                    <Button
                      onClick={handleReset}
                      variant="text"
                      size="sm"
                      className="w-full"
                      disabled={!selectedDate}
                    >
                      Сбросить
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )}

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
