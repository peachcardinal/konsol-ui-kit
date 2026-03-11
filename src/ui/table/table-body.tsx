import type React from 'react'
import { useEffect, useRef, useState } from 'react'

import type { Cell, Row as TanRow, Table as TanTable } from '@tanstack/react-table'

import type { ColumnMeta, FixedShadowEdges, ScrollState, StickyOffsets } from './table-internal-types'
import type { TableProps as AntLikeTableProps, TableRecord } from './table-types'

import { flexRender } from '@tanstack/react-table'

import { cn } from '@/lib/utils'

import { getTextAlignClass } from './table-align'
import { TableEmptyState } from './table-empty-state'
import { getEdgeShadow, getStickyStyle, mergeBoxShadow } from './table-sticky'

export interface TableBodyProps<TRecord extends TableRecord = TableRecord> {
  table: TanTable<TRecord>
  columnsCount: number
  onRow?: AntLikeTableProps<TRecord>['onRow']
  locale?: AntLikeTableProps<TRecord>['locale']
  stickyOffsets: StickyOffsets
  fixedShadowEdges: FixedShadowEdges
  scrollState: ScrollState
  highlightNewRows?: boolean
  tbodyDataTestId?: string
  rowDataTestId?: string
}

export function TableBody<TRecord extends TableRecord = TableRecord>({
  table,
  columnsCount,
  onRow,
  locale,
  stickyOffsets,
  fixedShadowEdges,
  scrollState,
  highlightNewRows = false,
  tbodyDataTestId,
  rowDataTestId,
}: TableBodyProps<TRecord>) {
  const rows = table.getRowModel().rows
  const [newRowIds, setNewRowIds] = useState<Set<string>>(() => new Set())
  const prevRowIdsRef = useRef<Set<string> | null>(null)
  const timeoutsRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
      timeoutsRef.current.clear()
    }
  }, [])

  useEffect(() => {
    if (!highlightNewRows) {
      prevRowIdsRef.current = null
      setNewRowIds(new Set())
      timeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId))
      timeoutsRef.current.clear()
      return
    }

    const currentIds = rows.map(r => r.id)

    // Комментарий: на первом рендере не подсвечиваем все строки.
    if (prevRowIdsRef.current === null) {
      prevRowIdsRef.current = new Set(currentIds)
      return
    }

    const prevIds = prevRowIdsRef.current
    const addedIds = currentIds.filter(id => !prevIds.has(id))
    prevRowIdsRef.current = new Set(currentIds)

    if (addedIds.length === 0)
      return

    setNewRowIds((old) => {
      const next = new Set(old)
      addedIds.forEach(id => next.add(id))
      return next
    })

    // Комментарий: плавная подсветка новых строк на короткое время.
    addedIds.forEach((id) => {
      const existing = timeoutsRef.current.get(id)
      if (existing)
        window.clearTimeout(existing)

      const timeoutId = window.setTimeout(() => {
        setNewRowIds((old) => {
          if (!old.has(id))
            return old
          const next = new Set(old)
          next.delete(id)
          return next
        })
        timeoutsRef.current.delete(id)
      }, 1400)

      timeoutsRef.current.set(id, timeoutId)
    })
  }, [highlightNewRows, rows])

  if (rows.length === 0) {
    return (
      <tbody data-testid={tbodyDataTestId}>
        <tr data-testid={rowDataTestId}>
          <td colSpan={Math.max(1, columnsCount)} className="p-0">
            <TableEmptyState locale={locale} />
          </td>
        </tr>
      </tbody>
    )
  }

  return (
    <tbody data-testid={tbodyDataTestId}>
      {rows.map((row: TanRow<TRecord>) => {
        const rowIndex = row.index
        const rowProps = onRow?.(row.original, rowIndex) ?? {}
        const hasRowClick = typeof rowProps.onClick === 'function'
        const handleRowClick = rowProps.onClick
        const isNew = highlightNewRows && newRowIds.has(row.id)

        const handleRowKeyDown: React.KeyboardEventHandler<HTMLTableRowElement> = (event) => {
          rowProps.onKeyDown?.(event)

          if (!hasRowClick)
            return
          if (event.key !== 'Enter' && event.key !== ' ')
            return

          event.preventDefault()
          event.currentTarget.click()
        }

        const mergedRowClassName = cn(
          'group transition-colors',
          isNew && 'data-[new=true]:animate-in data-[new=true]:fade-in-0',
          // Комментарий: если передан onRow — считаем строку интерактивной (как переход/роутинг в main-app)
          (onRow || hasRowClick) && 'cursor-pointer',
          rowProps.className,
        )

        const cellBgClassName = cn(
          'bg-background group-hover:bg-[#F6F6F7]',
          isNew && 'bg-primary/5 group-hover:bg-primary/10',
        )

        return (
          <tr
            data-testid={rowDataTestId}
            key={row.id}
            {...rowProps}
            data-new={isNew ? 'true' : undefined}
            className={mergedRowClassName}
            onClick={handleRowClick}
            onKeyDown={hasRowClick ? handleRowKeyDown : rowProps.onKeyDown}
            role={hasRowClick ? (rowProps.role ?? 'button') : rowProps.role}
            tabIndex={hasRowClick ? (rowProps.tabIndex ?? 0) : rowProps.tabIndex}
            aria-label={hasRowClick ? (rowProps['aria-label'] ?? 'Открыть строку') : rowProps['aria-label']}
          >
            {row.getVisibleCells().map((cell: Cell<TRecord, unknown>) => {
              const meta = cell.column.columnDef.meta as ColumnMeta | undefined
              const record = row.original
              const isLastRow = rowIndex === rows.length - 1

              const content = flexRender(cell.column.columnDef.cell, cell.getContext())
              const cellStyle = meta?.cellStyle?.(record, rowIndex)
              const cellClass = meta?.cellClassName?.(record, rowIndex)

              const alignClass = getTextAlignClass(meta?.align)
              const stickyStyle = getStickyStyle(meta?.fixed, cell.column.id, stickyOffsets)
              const edgeShadow = getEdgeShadow(meta?.fixed, cell.column.id, fixedShadowEdges, scrollState)

              return (
                <td
                  key={cell.id}
                  data-testid={meta?.['data-testid']}
                  className={cn(
                    'align-top border-b border-default-background p-2',
                    cellBgClassName,
                    alignClass,
                    meta?.className,
                    cellClass,
                    isLastRow && 'border-b-0',
                    (meta?.fixed === 'left' || meta?.fixed === 'right') && 'sticky z-10',
                  )}
                  style={{
                    width: meta?.width,
                    minWidth: meta?.minWidth,
                    maxWidth: meta?.maxWidth,
                    ...cellStyle,
                    ...stickyStyle,
                    boxShadow: mergeBoxShadow(
                      (cellStyle?.boxShadow as string | undefined) ?? undefined,
                      edgeShadow,
                    ),
                  }}
                >
                  {content}
                </td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  )
}
