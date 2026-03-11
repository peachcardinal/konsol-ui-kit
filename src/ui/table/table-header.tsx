import type { Header, HeaderGroup, Table as TanTable } from '@tanstack/react-table'

import type { ColumnMeta, FixedShadowEdges, ScrollState, StickyOffsets } from './table-internal-types'
import type { Column, TableRecord } from './table-types'

import { flexRender } from '@tanstack/react-table'

import { Icon } from '@/components/icon'
import { cn } from '@/lib/utils'

import { getJustifyAlignClass, getTextAlignClass } from './table-align'
import { columnKeyOf } from './table-columns'
import { getEdgeShadow, getStickyStyle, mergeBoxShadow } from './table-sticky'

export interface TableHeaderProps<TRecord extends TableRecord = TableRecord> {
  table: TanTable<TRecord>
  columns: Column<TRecord>[]
  sorting: { id: string, desc: boolean }[]
  stickyHeader: boolean
  showSorterTooltip: boolean
  stickyOffsets: StickyOffsets
  fixedShadowEdges: FixedShadowEdges
  scrollState: ScrollState
}

export function TableHeader<TRecord extends TableRecord = TableRecord>({
  table,
  columns,
  sorting,
  stickyHeader,
  showSorterTooltip,
  stickyOffsets,
  fixedShadowEdges,
  scrollState,
}: TableHeaderProps<TRecord>) {
  void showSorterTooltip

  return (
    <thead>
      {table.getHeaderGroups().map((hg: HeaderGroup<TRecord>) => (
        <tr key={hg.id} className="h-[37px]">
          {hg.headers.map((header: Header<TRecord, unknown>) => {
            const meta = header.column.columnDef.meta as ColumnMeta | undefined
            const canSort = header.column.getCanSort()
            const sortDir = header.column.getIsSorted()
            void sortDir
            const sortTitle = undefined

            const alignClass = getTextAlignClass(meta?.align)
            const stickyStyle = getStickyStyle(meta?.fixed, header.column.id, stickyOffsets)
            const edgeShadow = getEdgeShadow(meta?.fixed, header.column.id, fixedShadowEdges, scrollState)

            const handleHeaderClick = canSort ? header.column.getToggleSortingHandler() : undefined

            const headerNode = header.isPlaceholder ?
              null :
                flexRender(header.column.columnDef.header, header.getContext())

            // antd-like: прокидываем sortColumns в title-функцию
            const colIdx = columns.findIndex((c, idx) => columnKeyOf(c, idx) === header.column.id)
            const rawCol = colIdx >= 0 ? columns[colIdx] : undefined
            const titleNode = typeof rawCol?.title === 'function' ?
                rawCol.title({
                  sortColumns: sorting.map(s => ({
                    column: { dataIndex: s.id, key: s.id, columnKey: s.id },
                    order: s.desc ? 'descend' : 'ascend',
                  })),
                }) :
              headerNode

            return (
              <th
                key={header.id}
                data-testid={meta?.['data-testid']}
                className={cn(
                  'bg-[#FBFBFB] align-middle',
                  alignClass,
                  // antd-like typography for header (p1 + medium + secondary)
                  'font-graphik text-[12px] leading-[16px] font-medium text-secondary',
                  stickyHeader && 'sticky top-0 z-10',
                  canSort && 'cursor-pointer select-none',
                  meta?.className,
                  // antd-like: padding 8px, высота ~37px
                  'group border-b border-default-background p-2',
                  (meta?.fixed === 'left' || meta?.fixed === 'right') && 'sticky z-20',
                )}
                style={{
                  ...meta?.headerStyle,
                  width: meta?.width,
                  minWidth: meta?.minWidth,
                  maxWidth: meta?.maxWidth,
                  ...stickyStyle,
                  boxShadow: mergeBoxShadow(
                    meta?.headerStyle?.boxShadow as string | undefined,
                    edgeShadow,
                  ),
                }}
                onClick={handleHeaderClick}
              >
                <div className={cn('flex w-full items-center gap-2', getJustifyAlignClass(meta?.align))}>
                  {titleNode}

                  {canSort && (
                    <span title={sortTitle} className="inline-flex items-center">
                      <Icon
                        aria-hidden
                        icon={
                          sortDir === 'asc' ?
                            'ArrowUpIcon' :
                            sortDir === 'desc' ?
                              'ArrowDownIcon' :
                              'SortIcon'
                        }
                        size={16}
                        className={cn(
                          // antd-like: base 0.45 = secondary, hover тоже оставляем в secondary (без “черного”)
                          'text-secondary',
                          canSort && 'group-hover:text-secondary',
                        )}
                      />
                    </span>
                  )}
                </div>
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  )
}
