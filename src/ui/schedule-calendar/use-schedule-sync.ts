import React, { useCallback, useEffect, useState } from 'react'

import { getThreeMonthsAround } from './utils'

export interface UseScheduleSyncParams {
  /** Управляемое значение выбранной даты */
  value?: Date
  /** Дефолтная дата (неуправляемая) */
  defaultValue?: Date
  /** Колбэк изменения даты */
  onChange?: (date: Date) => void
}

export interface UseScheduleSyncResult {
  /** Текущая выбранная дата */
  selectedDate: Date
  /** Массив месяцев для отображения в календаре */
  months: Array<{ year: number, month: number }>
  /** Обработчик изменения даты из CalendarStrip */
  handleDateChange: (date: Date) => void
  /** Обработчик изменения месяцев из ScheduleHeader */
  handleMonthsChange: (months: Array<{ year: number, month: number }>) => void
  /** Триггер для скролла к первому числу месяца (для CalendarStrip) */
  scrollTrigger?: { date: Date, timestamp: number, mode?: 'monthStart' | 'date' }
  /** Колбэк для очистки scrollTrigger */
  clearScrollTrigger: () => void
  /** Колбэк для возврата к сегодняшней дате и дефолтному состоянию */
  resetToToday: () => void
}

/**
 * Хук для синхронизации ScheduleHeader и CalendarStrip
 * Управляет всей логикой выбора даты и месяцев
 */
export function useScheduleSync({
  value,
  defaultValue,
  onChange,
}: UseScheduleSyncParams = {}): UseScheduleSyncResult {
  const initialDate = value || defaultValue || new Date()

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate)
  const [months, setMonths] = useState<Array<{ year: number, month: number }>>(
    () => getThreeMonthsAround(initialDate),
  )
  const [scrollTrigger, setScrollTrigger] = useState<{ date: Date, timestamp: number, mode?: 'monthStart' | 'date' } | undefined>()

  // Вызываем onChange с начальной датой при монтировании (только один раз)
  const hasInitializedRef = React.useRef(false)
  useEffect(() => {
    if (!hasInitializedRef.current) {
      onChange?.(initialDate)
      hasInitializedRef.current = true
    }
  }, [onChange, initialDate])

  // Синхронизируем с управляемым значением
  useEffect(() => {
    if (value) {
      setSelectedDate(value)
    }
  }, [value])

  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date)

    // Автоматически обновляем месяцы при выборе даты
    const newMonths = getThreeMonthsAround(date)
    const monthsChanged = JSON.stringify(months) !== JSON.stringify(newMonths)

    if (monthsChanged) {
      setMonths(newMonths)
    }

    onChange?.(date)
  }, [onChange, months])

  const handleMonthsChange = useCallback((newMonths: Array<{ year: number, month: number }>) => {
    setMonths(newMonths)

    // Триггерим скролл к первому числу среднего месяца (БЕЗ выбора даты)
    if (newMonths.length > 0) {
      const middleIndex = Math.floor(newMonths.length / 2)
      const middleMonth = newMonths[middleIndex]
      const firstDayOfMonth = new Date(middleMonth.year, middleMonth.month, 1)

      // Только триггерим скролл, НЕ меняем selectedDate
      setScrollTrigger({ date: firstDayOfMonth, timestamp: Date.now(), mode: 'monthStart' })
    }
  }, [])

  const clearScrollTrigger = useCallback(() => {
    setScrollTrigger(undefined)
  }, [])

  const resetToToday = useCallback(() => {
    const today = new Date()
    setSelectedDate(today)

    const newMonths = getThreeMonthsAround(today)
    setMonths(newMonths)

    // Триггерим скролл к сегодняшней дате (центрирование)
    setScrollTrigger({ date: today, timestamp: Date.now(), mode: 'date' })

    onChange?.(today)
  }, [onChange])

  return {
    selectedDate,
    months,
    handleDateChange,
    handleMonthsChange,
    scrollTrigger,
    clearScrollTrigger,
    resetToToday,
  }
}
