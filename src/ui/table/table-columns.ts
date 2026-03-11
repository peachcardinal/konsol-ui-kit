import type { ReactNode } from 'react'

import type { ColumnDef } from '@tanstack/react-table'

import type { ColumnMeta } from './table-internal-types'
import type { Column, TableRecord } from './table-types'

import { getByDataIndex } from './utils'

export function columnKeyOf<TRecord extends TableRecord>(col: Column<TRecord>, idx: number): string {
  if (typeof col.dataIndex === 'string' && col.dataIndex.length > 0)
    return col.dataIndex
  if (typeof col.columnKey === 'string' && col.columnKey.length > 0)
    return col.columnKey
  if (typeof col.key === 'string' && col.key.length > 0)
    return col.key
  return `col_${idx}`
}

export function toColumnDef<TRecord extends TableRecord>(col: Column<TRecord>, idx: number): ColumnDef<TRecord, unknown> {
  const id = columnKeyOf(col, idx)
  const isStrictWidth = typeof col.width === 'number'

  const meta: ColumnMeta = {
    width: col.width,
    minWidth: col.minWidth ?? (isStrictWidth ? col.width : undefined),
    maxWidth: col.maxWidth ?? (isStrictWidth ? col.width : undefined),
    className: col.className,
    align: col.align,
    fixed: col.fixed,
    headerStyle: col.onHeaderCell?.()?.style,
    'data-testid': col['data-testid'],
    defaultSortOrder: col.defaultSortOrder,
    cellStyle: col.onCell ?
        (record, index) => col.onCell?.(record as TRecord, index)?.style :
      undefined,
    cellClassName: col.onCell ?
        (record, index) => col.onCell?.(record as TRecord, index)?.className :
      undefined,
  }

  return {
    id,
    accessorFn: (row: TRecord) => getByDataIndex(row, col.dataIndex ?? id),
    enableSorting: Boolean(col.sorter),
    meta,
    header: () => col.title,
    cell: (ctx) => {
      const record = ctx.row.original
      const index = ctx.row.index
      const value = ctx.getValue()
      return col.render ? col.render(value, record, index) : (value as ReactNode)
    },
  }
}
