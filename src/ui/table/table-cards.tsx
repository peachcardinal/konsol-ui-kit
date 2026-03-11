import React from 'react'

import type { TableProps, TableRecord } from './table-types'

import { cn } from '@/lib/utils'

import { Card } from '../card'
import { TableCardsSkeleton } from './table-cards-skeleton'
import { TableEmptyState } from './table-empty-state'

export interface TableCardsProps<TRecord extends TableRecord = TableRecord> {
  items?: TRecord[]
  loading?: boolean
  /** Кол-во карточек скелетона при loading=true */
  loadingRows?: number

  className?: string

  locale?: TableProps<TRecord>['locale']
  getCardKey?: (record: TRecord, index: number) => React.Key
  getCardProps?: (record: TRecord, index: number) => React.HTMLAttributes<HTMLDivElement> & { 'data-testid'?: string }
  children?: (record: TRecord, index: number) => React.ReactNode
}

export function TableCards<TRecord extends TableRecord = TableRecord>({
  items,
  loading,
  loadingRows,
  className,
  locale,
  getCardKey,
  getCardProps,
  children,
}: TableCardsProps<TRecord>) {
  const isLoading = Boolean(loading)
  const skeletonRowsCount = Math.max(1, Math.floor(loadingRows ?? 10))
  const resolvedItems = items ?? []

  if (isLoading) {
    return (
      <div className={cn('flex flex-col gap-3 p-3', className)} aria-busy={loading}>
        <TableCardsSkeleton
          rowsCount={skeletonRowsCount}
          linesCount={6}
        />
      </div>
    )
  }

  if (resolvedItems.length === 0) {
    return (
      <div className={className} aria-busy={loading}>
        <TableEmptyState locale={locale} />
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-2', className)} aria-busy={loading}>
      {resolvedItems.map((record, recordIndex) => {
        const cardProps = getCardProps?.(record, recordIndex) ?? {}
        const hasCardClick = typeof cardProps.onClick === 'function'
        const keyValue = getCardKey?.(record, recordIndex) ?? recordIndex

        const handleCardClick = cardProps.onClick
        const handleCardKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
          cardProps.onKeyDown?.(event)

          if (!hasCardClick)
            return
          if (event.key !== 'Enter' && event.key !== ' ')
            return

          event.preventDefault()
          event.currentTarget.click()
        }

        const mergedCardClassName = cn(
          hasCardClick && 'cursor-pointer hover:bg-[#F6F6F7]',
          hasCardClick && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          cardProps.className,
        )

        return (
          <Card
            key={String(keyValue)}
            bordered
            radius="lg"
            padding="xs"
            {...cardProps}
            className={mergedCardClassName}
            onClick={handleCardClick}
            onKeyDown={hasCardClick ? handleCardKeyDown : cardProps.onKeyDown}
            role={hasCardClick ? (cardProps.role ?? 'button') : cardProps.role}
            tabIndex={hasCardClick ? (cardProps.tabIndex ?? 0) : cardProps.tabIndex}
            aria-label={hasCardClick ? (cardProps['aria-label'] ?? 'Открыть карточку') : cardProps['aria-label']}
          >
            {children?.(record, recordIndex)}
          </Card>
        )
      })}
    </div>
  )
}
