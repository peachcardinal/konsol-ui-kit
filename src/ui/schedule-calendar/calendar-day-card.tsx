import React from 'react'

import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

import { formatWeekdayShort, startOfDay } from './utils'

export interface CalendarDayCardProps {
  date: Date
  selected: boolean
  renderBadge?: (date: Date) => React.ReactNode
  onClick: () => void
  className?: string
}

export const CalendarDayCard: React.FC<CalendarDayCardProps> = ({
  date,
  selected,
  renderBadge,
  onClick,
  className,
}) => {
  const isToday = startOfDay(date).getTime() === startOfDay(new Date()).getTime()

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex h-[70px] w-[70px] shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl text-center transition-colors',
        'border-0 bg-default-background',
        'hover:bg-border',
        selected && 'border-default bg-white border-1',
        className,
      )}
    >
      {renderBadge && (
        <div className="absolute right-1 top-1">{renderBadge(date)}</div>
      )}
      <div className="flex flex-col items-center justify-center gap-0.5">
        <Typography variant="p3" weight="medium">
          {date.getDate()}
        </Typography>
        <Typography variant="p1" textColor="secondary">
          {isToday ? 'Сегодня' : formatWeekdayShort(date)}
        </Typography>
      </div>
    </button>
  )
}
