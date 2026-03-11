import { addMonths, startOfDay as dateFnsStartOfDay, format } from 'date-fns'
import { ru } from 'date-fns/locale'

/**
 * Утилиты для работы с датами в календаре
 */

export function formatWeekdayShort(date: Date): string {
  const s = format(date, 'EEEEEE', { locale: ru })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function startOfDay(date: Date): Date {
  return dateFnsStartOfDay(date)
}

export function formatMonthLong(date: Date): string {
  return format(date, 'LLLL yyyy', { locale: ru })
}

const MONTHS_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

export function formatMonthGenitive(date: Date): string {
  return MONTHS_GENITIVE[date.getMonth()]
}

export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function getThreeMonthsAround(date: Date): Array<{ year: number, month: number }> {
  const prevMonth = addMonths(startOfDay(new Date(date.getFullYear(), date.getMonth(), 1)), -1)
  const currentMonth = startOfDay(new Date(date.getFullYear(), date.getMonth(), 1))
  const nextMonth = addMonths(currentMonth, 1)

  return [
    { year: prevMonth.getFullYear(), month: prevMonth.getMonth() },
    { year: currentMonth.getFullYear(), month: currentMonth.getMonth() },
    { year: nextMonth.getFullYear(), month: nextMonth.getMonth() },
  ]
}
