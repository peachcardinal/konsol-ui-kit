import { useEffect, useMemo, useRef, useState } from 'react'

export interface ScheduleStripConfig {
  /** Сколько дней слева от центра показывать (deprecated, используй months) */
  daysLeft?: number
  /** Сколько дней справа от центра показывать (deprecated, используй months) */
  daysRight?: number
}

export interface UseScheduleCalendarParams {
  /** Выбранная дата (управляемая) */
  value?: Date
  /** Дефолтная дата (неуправляемая) */
  defaultValue?: Date
  /** Список месяцев для отображения всех дат (если не передан - текущий месяц) */
  months?: Array<{ year: number, month: number }> // month: 0-11
  /** Колбэк изменения даты */
  onChange?: (date: Date) => void
  /** Конфиг размеров окна (deprecated) */
  config?: ScheduleStripConfig
}

export interface UseScheduleCalendarResult {
  selectedDate: Date
  days: Date[]
  setSelectedDate: (date: Date) => void
}

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getAllDaysForMonths(months: Array<{ year: number, month: number }>): Date[] {
  const result: Date[] = []
  for (const m of months) {
    const daysCount = getDaysInMonth(m.year, m.month)
    for (let day = 1; day <= daysCount; day++) {
      result.push(startOfDay(new Date(m.year, m.month, day)))
    }
  }
  return result
}

export function useScheduleCalendar({
  value,
  defaultValue,
  months: monthsProp,
  onChange,
}: UseScheduleCalendarParams): UseScheduleCalendarResult {
  const todayRef = useRef<Date>(startOfDay(new Date()))
  const baseDate = startOfDay(value || defaultValue || todayRef.current)

  const [selectedDate, setSelected] = useState<Date>(baseDate)

  // Если months не передан, используем текущий месяц
  const months = useMemo(() => {
    if (monthsProp && monthsProp.length > 0)
      return monthsProp
    const today = todayRef.current
    return [{ year: today.getFullYear(), month: today.getMonth() }]
  }, [monthsProp])

  // Вычисляем все дни для выбранных месяцев
  const days = useMemo(() => {
    return getAllDaysForMonths(months)
  }, [months])

  useEffect(() => {
    const next = startOfDay(value || defaultValue || todayRef.current)
    if (next.getTime() !== selectedDate.getTime())
      setSelected(next)
  }, [value, defaultValue])

  const setSelectedDate = (d: Date) => {
    const normalized = startOfDay(d)
    setSelected(normalized)
    onChange?.(normalized)
  }

  return {
    selectedDate,
    days,
    setSelectedDate,
  }
}
