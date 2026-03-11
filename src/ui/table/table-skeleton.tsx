import type { Table as TanTable } from '@tanstack/react-table'

import type { ColumnMeta, FixedShadowEdges, ScrollState, StickyOffsets } from './table-internal-types'
import type { TableRecord } from './table-types'

import { cn } from '@/lib/utils'

import { getTextAlignClass } from './table-align'
import { getEdgeShadow, getStickyStyle, mergeBoxShadow } from './table-sticky'

export interface TableSkeletonProps<TRecord extends TableRecord = TableRecord> {
  table: TanTable<TRecord>
  rowsCount: number
  stickyOffsets: StickyOffsets
  fixedShadowEdges: FixedShadowEdges
  scrollState: ScrollState
}

export function TableSkeleton<TRecord extends TableRecord = TableRecord>({
  table,
  rowsCount,
  stickyOffsets,
  fixedShadowEdges,
  scrollState,
}: TableSkeletonProps<TRecord>) {
  const safeCount = Math.max(1, Math.floor(rowsCount))

  return (
    <>
      {Array.from({ length: safeCount }).map((_, rowIndex) => {
        const isLastRow = rowIndex === safeCount - 1
        const visibleCols = table.getVisibleLeafColumns()

        return (
          <tr key={`skeleton_${rowIndex}`} className="animate-pulse">
            {visibleCols.map((col) => {
              const meta = col.columnDef.meta as ColumnMeta | undefined
              const alignClass = getTextAlignClass(meta?.align)

              const stickyStyle = getStickyStyle(meta?.fixed, col.id, stickyOffsets)
              const edgeShadow = getEdgeShadow(meta?.fixed, col.id, fixedShadowEdges, scrollState)

              return (
                <td
                  key={`skeleton_${rowIndex}_${col.id}`}
                  className={cn(
                    'align-top border-b border-border p-2',
                    alignClass,
                    isLastRow && 'border-b-0',
                    (meta?.fixed === 'left' || meta?.fixed === 'right') && 'sticky z-10 bg-background',
                  )}
                  style={{
                    width: meta?.width,
                    minWidth: meta?.minWidth,
                    maxWidth: meta?.maxWidth,
                    ...stickyStyle,
                    boxShadow: mergeBoxShadow(undefined, edgeShadow),
                  }}
                >
                  <div
                    className={cn(
                      'h-3 w-full rounded bg-muted',
                      meta?.align === 'center' && 'mx-auto',
                      meta?.align === 'right' && 'ml-auto',
                    )}
                    style={{
                      // Комментарий: небольшая “рандомизация” ширины, чтобы выглядело естественнее
                      width: `${Math.max(40, 90 - (rowIndex * 7) % 40)}%`,
                    }}
                  />
                </td>
              )
            })}
          </tr>
        )
      })}
    </>
  )
}
