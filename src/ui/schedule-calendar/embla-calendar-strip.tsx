import React, { useCallback, useEffect } from 'react'

import useEmblaCarousel from 'embla-carousel-react'

import { cn } from '@/lib/utils'

import { EmblaCalendarCard } from './embla-calendar-card'
import { startOfDay } from './utils'

export interface EmblaCalendarStripProps {
  dates: Date[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  renderBadge?: (date: Date) => React.ReactNode
  dayClassName?: string
  classNames?: {
    root?: string
    content?: string
    card?: string
  }
}

export const EmblaCalendarStrip: React.FC<EmblaCalendarStripProps> = ({
  dates,
  selectedDate,
  onDateSelect,
  renderBadge,
  dayClassName,
  classNames,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: 'trimSnaps',
    align: 'start',
  })

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit()
    }
  }, [dates, emblaApi])

  const getSelectedIndex = useCallback(() => {
    if (!selectedDate)
      return -1
    return dates.findIndex(
      d => startOfDay(d).getTime() === startOfDay(selectedDate).getTime(),
    )
  }, [dates, selectedDate])

  useEffect(() => {
    if (!emblaApi)
      return
    const index = getSelectedIndex()
    if (index >= 0) {
      emblaApi.scrollTo(index)
    }
  }, [emblaApi, getSelectedIndex])

  const handleDateClick = useCallback(
    (date: Date) => {
      onDateSelect?.(date)
    },
    [onDateSelect],
  )

  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate)
      return false
    return startOfDay(date).getTime() === startOfDay(selectedDate).getTime()
  }

  return (
    <div className={cn('overflow-hidden', classNames?.root)} ref={emblaRef}>
      <div className={cn('flex gap-1.5', classNames?.content)}>
        {dates.map((date) => {
          return (
            <EmblaCalendarCard
              key={date.toISOString()}
              date={date}
              selected={isDateSelected(date)}
              onClick={() => handleDateClick(date)}
              renderBadge={renderBadge ? () => renderBadge(date) : undefined}
              className={cn(dayClassName, classNames?.card)}
            />
          )
        })}
      </div>
    </div>
  )
}
