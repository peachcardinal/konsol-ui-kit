import type { TableProps, TableRecord } from './table-types'

import { Typography } from '../Typography'
import emptyBoxPng from './assets/empty-box.png'

export interface TableEmptyStateProps<TRecord extends TableRecord = TableRecord> {
  locale?: TableProps<TRecord>['locale']
  className?: string
}

export function TableEmptyState<TRecord extends TableRecord = TableRecord>({
  locale,
  className,
}: TableEmptyStateProps<TRecord>) {
  const emptyTitle = locale?.emptyTitle ?? 'Всё чисто'
  const emptyDescription = locale?.emptyDescription ?? 'Добавьте что-нибудь, чтобы начать работу'

  if (locale?.emptyText) {
    return <>{locale.emptyText}</>
  }

  return (
    <div
      className={className ?? 'flex h-[300px] w-full flex-col items-center justify-center gap-2.5'}
      role="status"
      aria-label="Пустая таблица"
    >
      <img
        src={emptyBoxPng}
        alt=""
        className="h-24 w-24 select-none"
        draggable={false}
      />
      <div className="flex flex-col items-center gap-1">
        <Typography variant="h4" weight="medium">{emptyTitle}</Typography>
        <Typography variant="p2">
          {emptyDescription}
        </Typography>
      </div>
    </div>
  )
}
