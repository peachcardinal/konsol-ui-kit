import React, { useEffect, useMemo, useState } from 'react'

import { addMonths, format } from 'date-fns'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

import { formatMonthLong, getThreeMonthsAround } from './utils'

export interface ScheduleHeaderProps {
  /** Текущая выбранная дата */
  anchorDate?: Date
  /** Колбэк при выборе месяца в дропдауне */
  onChange?: (date: Date) => void
  /** Колбэк для обновления месяцев (опционально, для синхронизации с CalendarStrip) */
  onMonthsChange?: (months: Array<{ year: number, month: number }>) => void
  /** Массив месяцев для отображения текущего выбранного месяца (опционально) */
  months?: Array<{ year: number, month: number }>
  /** CSS класс */
  className?: string
  /** Тестовые идентификаторы */
  testIds?: {
    /** data-testid для селектора периодов (триггер) */
    periodSelector?: string
  }
}

function toIsoDate(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  anchorDate,
  onChange,
  onMonthsChange,
  months: monthsProp,
  className,
  testIds,
}) => {
  const today = new Date()
  const base = anchorDate || today
  const [current, setCurrent] = useState<Date>(base)
  const [currentValue, setCurrentValue] = useState<string>('')

  useEffect(() => {
    if (anchorDate)
      setCurrent(anchorDate)
  }, [anchorDate])

  const options = useMemo(() => {
    const arr: { value: string, label: string, date: Date }[] = []

    // Добавляем только одиночные месяцы
    for (let i = -12; i <= 12; i++) {
      const d = addMonths(new Date(today.getFullYear(), today.getMonth(), 1), i)
      arr.push({ value: toIsoDate(d), label: formatMonthLong(d), date: d })
    }

    return arr
  }, [])

  const value = useMemo(() => {
    if (currentValue)
      return currentValue
    const firstDay = new Date(current.getFullYear(), current.getMonth(), 1)
    return toIsoDate(firstDay)
  }, [current, currentValue])

  const handleChange = (val: string) => {
    const found = options.find(o => o.value === val)
    if (!found)
      return

    setCurrentValue(val)
    const newDate = found.date
    setCurrent(newDate)

    if (onMonthsChange) {
      onMonthsChange(getThreeMonthsAround(newDate))
    }

    onChange?.(newDate)
  }

  // Вычисляем лейбл - показываем средний месяц из диапазона (текущий выбранный)
  const displayLabel = useMemo(() => {
    if (monthsProp && monthsProp.length > 0) {
      const middleIndex = Math.floor(monthsProp.length / 2)
      const middleMonth = monthsProp[middleIndex]
      const d = new Date(middleMonth.year, middleMonth.month, 1)
      return formatMonthLong(d)
    }
    return formatMonthLong(current)
  }, [monthsProp, current])

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger
        className={cn('[&_svg]:h-6 [&_svg]:w-6 [&_svg]:text-secondary', className)}
        size="lg"
        transparent
        inlineSelect
        data-testid={testIds?.periodSelector}
      >
        <SelectValue>
          <Typography variant="h1" weight="normal">
            {displayLabel}
          </Typography>
        </SelectValue>
      </SelectTrigger>
      <SelectContent size="lg">
        {options.map(opt => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default ScheduleHeader
