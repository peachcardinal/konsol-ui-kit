import React from 'react'
import type { CaptionLabelProps } from 'react-day-picker'
import { DayPicker } from 'react-day-picker'

import { format } from 'date-fns'

import { buttonVariants } from '../button'
import { cn } from '../../lib/utils'

import { Icon } from '../Icon'
import { Typography } from '../Typography'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-0 md:p-[10px] md:pb-0', className)}
      classNames={{
        months: 'flex flex-col md:flex-row gap-2',
        month: 'flex flex-col gap-3 items-center md:items-start font-medium',
        caption: 'flex justify-center pt-1 relative items-center w-full',
        caption_label: 'text-[14px] font-graphik',
        nav: 'flex items-center gap-1',
        nav_button: cn(
          buttonVariants({ variant: 'default', iconOnly: true }),
          'size-8 md:size-6',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse md:w-auto',
        head_row: 'flex items-center p-0',
        head_cell:
          'text-muted-foreground font-graphik text-[12px] w-full p-0 py-1 pb-3 font-normal',
        row: 'flex w-full mb-1',
        cell: cn(
          'relative w-full text-center text-[14px] focus-within:relative focus-within:z-20 px-[2px] py-0',
          props.mode === 'range' ?
              [
                '[&:has(>.day-range-end)]:rounded-r-md',
                '[&:has(>.day-range-start)]:rounded-l-md',
                '[&:has(.day-hover-range)]:bg-primary/10',
                '[&:has(.day-outside)]:bg-transparent',
              ].join(' ') :
            '[&:has([aria-selected])]:rounded-md',
        ),
        day: cn(
          'w-full h-8 md:h-auto md:w-auto md:size-8 bg-transparent border-0 p-0 font-graphik aria-selected:opacity-100 cursor-pointer rounded-l-md rounded-r-md hover:bg-muted',
        ),
        day_range_start: cn(
          'day-range-start',
          '[&:not(.day-outside)]:bg-primary',
          '[&:not(.day-outside)]:text-primary-foreground',
          'aria-selected:[&:not(.day-outside)]:bg-primary',
          'aria-selected:[&:not(.day-outside)]:text-primary-foreground',
        ),
        day_range_middle: cn(
          'day-range-middle',
          '[&:not(.day-outside)]:bg-primary-10',
          '[&:not(.day-outside)]:text-black',
        ),
        day_range_end: cn(
          'day-range-end',
          '[&:not(.day-outside)]:bg-primary',
          '[&:not(.day-outside)]:text-primary-foreground',
          'aria-selected:[&:not(.day-outside)]:bg-primary',
          'aria-selected:[&:not(.day-outside)]:text-primary-foreground',
        ),
        day_selected:
          'aria-selected:bg-primary text-primary-foreground hover:bg-primary hover:text-white focus:bg-primary focus:text-primary-foreground',
        day_today:
          'border-1 border-solid border-border-primary bg-background text-foreground rounded-md',
        day_outside:
          'day-outside text-muted-foreground aria-selected:text-muted-foreground aria-selected:bg-transparent !bg-transparent [&.day-range-start]:!bg-transparent [&.day-range-end]:!bg-transparent',
        day_disabled: 'day-outside text-muted-foreground aria-selected:text-muted-foreground aria-selected:bg-transparent !bg-transparent [&.day-range-start]:!bg-transparent [&.day-range-end]:!bg-transparent',
        day_hidden: 'invisible',
        ...classNames,
      }}
      fixedWeeks
      formatters={{
        formatWeekdayName: (date: Date, _options?: any): string => {
          const shortDay = locale ?
              format(date, 'EEEEEE', { locale }) :
              date.toLocaleDateString('ru-RU', { weekday: 'short' })
          return shortDay.charAt(0).toUpperCase() + shortDay.slice(1)
        },
      }}
      weekStartsOn={1}
      components={{
        IconLeft: () => <Icon icon="ArrowLeftIcon" />,
        IconRight: () => <Icon icon="ArrowRightIcon" />,
        CaptionLabel: ({ displayMonth }: CaptionLabelProps) => {
          const shortMonth = locale ?
              format(displayMonth, 'MMM', { locale }) :
              displayMonth.toLocaleString('ru-RU', { month: 'long' }).slice(0, 3)

          const year = displayMonth.getFullYear()

          return (
            <Typography variant="p2" weight="medium" className="font-graphik">
              {shortMonth}
              {' '}
              {year}
            </Typography>
          )
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
