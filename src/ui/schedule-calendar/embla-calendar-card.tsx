import React from 'react'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

import { formatMonthGenitive, formatWeekdayShort } from './utils'

export interface EmblaCalendarCardProps {
  date: Date
  selected?: boolean
  onClick?: () => void
  renderBadge?: () => React.ReactNode
  className?: string
}

export const EmblaCalendarCard: React.FC<EmblaCalendarCardProps> = ({
  date,
  selected,
  onClick,
  renderBadge,
  className = '',
}) => {
  const day = format(date, 'd', { locale: ru })
  const weekday = formatWeekdayShort(date)
  const month = formatMonthGenitive(date)

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative shrink-0 h-19.5 min-w-26.5 md:min-w-45.5',
        'rounded-lg transition-colors cursor-pointer',
        'flex flex-col items-start justify-start gap-1 p-3',
        'bg-transparent',
        'hover:bg-border',
        'first:ml-4 last:mr-4 border-1 border-border',
        selected && 'border-default bg-white border-1',
        className,
      )}
    >
      <div className="flex flex-col items-start justify-start gap-2">
        <div className="flex flex-row items-center justify-center gap-1">
          <Typography variant="p3" weight="medium">
            {day}
            {' '}
            {month}
          </Typography>
          <Typography variant="p3" textColor="secondary">
            {weekday}
          </Typography>
        </div>
        {renderBadge && renderBadge()}
      </div>
    </button>
  )
}
