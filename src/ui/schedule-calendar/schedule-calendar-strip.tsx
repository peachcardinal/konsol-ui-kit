import React, { useCallback, useEffect, useRef } from 'react'

import type { UseScheduleCalendarParams } from './use-schedule-calendar'

import { Button } from '../button'
import { CalendarDayCard } from './calendar-day-card'
import { CARD_WIDTH, MOBILE_BREAKPOINT, SCROLL_WEEK_SIZE } from './constants'
import { useScheduleCalendar } from './use-schedule-calendar'
import { startOfDay } from './utils'

export interface CalendarStripProps extends Omit<UseScheduleCalendarParams, 'onChange'> {
  /** Стилистика карточки дня */
  dayClassName?: string
  /** Рендер бейджа справа-сверху */
  renderBadge?: (date: Date) => React.ReactNode
  /** Изменение выбранной даты */
  onChange?: (date: Date) => void
  /** Колбэк для обновления видимых месяцев (для синхронизации с header) */
  onVisibleMonthsChange?: (months: Array<{ year: number, month: number }>) => void
  /** Показывать ли стрелки на md+ */
  showArrows?: boolean
  /** Триггер для скролла (при изменении скроллится к первому числу месяца) */
  scrollTrigger?: { date: Date, timestamp: number, mode?: 'monthStart' | 'date' }
  /** Колбэк для очистки scrollTrigger после скролла */
  onScrollComplete?: () => void
  /** Тестовые идентификаторы */
  testIds?: {
    /** data-testid для кнопки скролла влево */
    scrollLeftButton?: string
    /** data-testid для кнопки скролла вправо */
    scrollRightButton?: string
    /** data-testid для контейнера календаря */
    calendarStrip?: string
  }
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({
  onChange,
  dayClassName,
  renderBadge,
  showArrows = true,
  onVisibleMonthsChange,
  scrollTrigger,
  onScrollComplete,
  testIds,
  ...params
}) => {
  const { days, selectedDate, setSelectedDate } = useScheduleCalendar({
    ...params,
    onChange,
  })

  const scrollRef = useRef<HTMLDivElement | null>(null)

  const shift = useCallback((dir: -1 | 1) => {
    const el = scrollRef.current
    if (el) {
      const scrollAmount = SCROLL_WEEK_SIZE * CARD_WIDTH
      el.scrollBy({ left: dir > 0 ? scrollAmount : -scrollAmount, behavior: 'smooth' })
    }
  }, [])

  const isDateSelected = (date: Date): boolean => {
    return date.getTime() === selectedDate.getTime()
  }

  // Функция скролла к дате
  const scrollToDate = useCallback((targetDate: Date, smooth = false) => {
    if (scrollRef.current && days.length > 0) {
      const targetIndex = days.findIndex(d => d.getTime() === startOfDay(targetDate).getTime())

      if (targetIndex !== -1) {
        const containerWidth = scrollRef.current.offsetWidth
        const isMobile = window.innerWidth < MOBILE_BREAKPOINT

        const scrollPosition = isMobile ?
          targetIndex * CARD_WIDTH :
          targetIndex * CARD_WIDTH - containerWidth / 2 + CARD_WIDTH / 2

        if (smooth) {
          scrollRef.current.scrollTo({ left: Math.max(0, scrollPosition), behavior: 'smooth' })
        } else {
          scrollRef.current.scrollLeft = Math.max(0, scrollPosition)
        }
      }
    }
  }, [days])

  // Автоскролл к сегодняшней дате при монтировании
  useEffect(() => {
    if (days.length > 0) {
      const today = startOfDay(new Date())
      scrollToDate(today)
    }
  }, [])

  // Скролл при изменении scrollTrigger
  useEffect(() => {
    if (scrollTrigger && days.length > 0 && scrollRef.current) {
      const timeoutId = setTimeout(() => {
        if (scrollTrigger.mode === 'date') {
          // Центрируем конкретную дату (для resetToToday и подобных сценариев)
          scrollToDate(scrollTrigger.date, true)
        } else {
          // Базовое поведение: скролл к первому числу месяца без центрирования
          const firstDayOfMonth = startOfDay(new Date(
            scrollTrigger.date.getFullYear(),
            scrollTrigger.date.getMonth(),
            1,
          ))

          const targetIndex = days.findIndex(d => d.getTime() === firstDayOfMonth.getTime())
          if (targetIndex !== -1) {
            const scrollPosition = targetIndex * CARD_WIDTH
            scrollRef.current?.scrollTo({ left: Math.max(0, scrollPosition), behavior: 'smooth' })
          }
        }

        // Очищаем триггер после завершения скролла
        setTimeout(() => {
          onScrollComplete?.()
        }, 500)
      }, 50)

      return () => clearTimeout(timeoutId)
    }
  }, [scrollTrigger, days, onScrollComplete, scrollToDate])

  // Отслеживаем массив дат для бесшовной смены месяцев
  const prevDaysRef = useRef<Date[]>([])

  // Корректируем скролл при изменении days (бесшовное добавление/удаление месяцев)
  useEffect(() => {
    if (scrollRef.current && days.length > 0 && prevDaysRef.current.length > 0) {
      const prevDays = prevDaysRef.current
      const prevFirstDate = prevDays[0]
      const newFirstDate = days[0]

      // Находим индекс предыдущей первой даты в новом массиве
      const prevFirstIndex = days.findIndex(d => d.getTime() === prevFirstDate.getTime())

      if (prevFirstIndex > 0) {
        // Если предыдущая первая дата теперь не первая - добавились дни слева
        scrollRef.current.scrollLeft += prevFirstIndex * CARD_WIDTH
      } else if (prevFirstIndex === -1) {
        // Предыдущая первая дата исчезла - определяем направление
        const prevFirstTime = prevFirstDate.getTime()
        const newFirstTime = newFirstDate.getTime()

        if (newFirstTime < prevFirstTime) {
          // Новая первая дата раньше - добавились дни слева
          const daysDiff = Math.round((prevFirstTime - newFirstTime) / (1000 * 60 * 60 * 24))
          scrollRef.current.scrollLeft += daysDiff * CARD_WIDTH
        } else {
          // Новая первая дата позже - удалились дни слева, корректируем скролл назад
          const daysDiff = Math.round((newFirstTime - prevFirstTime) / (1000 * 60 * 60 * 24))
          scrollRef.current.scrollLeft = Math.max(0, scrollRef.current.scrollLeft - daysDiff * CARD_WIDTH)
        }
      }
    }

    prevDaysRef.current = [...days]
  }, [days])

  return (
    <div className="flex items-center gap-2.5">
      {showArrows && (
        <Button
          icon="ArrowLeftIcon"
          variant="text"
          iconOnly
          onClick={() => shift(-1)}
          className="hidden shrink-0 md:flex"
          data-testid={testIds?.scrollLeftButton}
        />
      )}

      <div
        className="overflow-x-auto md:overflow-x-hidden md:rounded-xl -mx-4 md:mx-0"
        ref={scrollRef}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex gap-2 pb-1 px-4 md:px-4" data-testid={testIds?.calendarStrip}>
          {days.map(d => (
            <CalendarDayCard
              key={d.toISOString()}
              date={d}
              selected={isDateSelected(d)}
              onClick={() => setSelectedDate(d)}
              renderBadge={renderBadge}
              className={dayClassName}
            />
          ))}
        </div>
      </div>

      {showArrows && (
        <Button
          icon="ArrowRightIcon"
          variant="text"
          iconOnly
          onClick={() => shift(1)}
          className="hidden shrink-0 md:flex"
          data-testid={testIds?.scrollRightButton}
        />
      )}
    </div>
  )
}

export default CalendarStrip
