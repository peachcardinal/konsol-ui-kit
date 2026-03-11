import type React from 'react'
import { useMemo, useRef, useState } from 'react'

import type { SortingState } from '@tanstack/react-table'

import type { TableProps as AntLikeTableProps, Column, SortDirection, SorterResult, TableRecord } from './table-types'

import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'

import { cn } from '@/lib/utils'

import { Checkbox } from '../checkbox'
import { TableBody } from './table-body'
import { TableColGroup } from './table-colgroup'
import { columnKeyOf, toColumnDef } from './table-columns'
import { TableHeader } from './table-header'
import { TableSkeleton } from './table-skeleton'
import { getFixedShadowEdges, getStickyOffsets } from './table-sticky'
import { useTableScrollState } from './use-table-scroll-state'

export type TableProps<TRecord extends TableRecord = TableRecord> = AntLikeTableProps<TRecord> & {
  /** алиас для совместимости с прошлой реализацией */
  tableClassName?: string
  /** если true — включаем клиентскую сортировку (по умолчанию off: сортировка headless) */
  clientSort?: boolean
  /** data-testid для tbody элемента */
  tbodyDataTestId?: string
  /** data-testid для всех tr элементов */
  rowDataTestId?: string
}

export function Table<TRecord extends TableRecord = TableRecord>({
  className,
  tableClassName,
  loading,
  loadingRows,
  scroll,
  stickyHeader = false,
  onChange,
  columns,
  dataSource,
  data,
  systemStyles = true,
  hideStickyScrollbar,
  clientSort = false,
  rowKey,
  rowSelection,
  highlightNewRows = false,
  pagination,
  showHeader = true,
  showSorterTooltip = true,
  onRow,
  locale,
  tbodyDataTestId,
  rowDataTestId = 'item',
}: TableProps<TRecord>) {
  const resolvedData = (dataSource ?? data ?? []) as TRecord[]
  const isLoading = Boolean(loading)
  const skeletonRowsCount = Math.max(1, Math.floor(loadingRows ?? 10))

  const scrollRef = useRef<HTMLDivElement | null>(null)

  const isRowSelectionEnabled = Boolean(rowSelection)
  const selectAllMode = rowSelection?.selectAllMode ?? (rowSelection?.selectAllScope === 'all' ? 'all' : 'page')

  const [internalSelectedRowKeys, setInternalSelectedRowKeys] = useState<React.Key[]>(
    () => rowSelection?.defaultSelectedRowKeys ?? [],
  )
  const isRowSelectionControlled = rowSelection?.selectedRowKeys !== undefined
  const selectedRowKeys = (rowSelection?.selectedRowKeys ?? internalSelectedRowKeys) as React.Key[]

  const selectedRowKeySet = useMemo(() => {
    return new Set(selectedRowKeys.map(k => String(k)))
  }, [selectedRowKeys])

  const selectionUtilityColumn: Column<TRecord> | null = useMemo(() => {
    if (!isRowSelectionEnabled)
      return null
    return {
      key: '__row_selection__',
      title: null,
      width: 44,
      minWidth: 44,
      maxWidth: 44,
      fixed: 'left',
      align: 'center',
      className: 'p-2',
      'data-testid': 'table-row-selection',
    }
  }, [isRowSelectionEnabled])

  const layoutColumns = useMemo(() => {
    if (!selectionUtilityColumn)
      return columns
    return [selectionUtilityColumn, ...columns]
  }, [columns, selectionUtilityColumn])

  const hasAnyFixedWidth = useMemo(
    () => layoutColumns.some(c => typeof c.width === 'number'),
    [layoutColumns],
  )

  const hasFixedColumns = useMemo(
    () => layoutColumns.some(c => c.fixed === 'left' || c.fixed === 'right'),
    [layoutColumns],
  )

  const fixedShadowEdges = useMemo(
    () => getFixedShadowEdges(layoutColumns, columnKeyOf),
    [layoutColumns],
  )

  const stickyOffsets = useMemo(
    () => getStickyOffsets(layoutColumns, columnKeyOf),
    [layoutColumns],
  )

  const getRowKeyValue = useMemo(() => {
    return (record: TRecord, index: number): React.Key => {
      if (typeof rowKey === 'function')
        return rowKey(record)
      if (rowKey) {
        const v = (record as Record<string, unknown>)?.[rowKey as string]
        return (v != null ? (v as React.Key) : index)
      }
      return index
    }
  }, [rowKey])

  const columnDefs = useMemo(() => {
    const selectionDef = !isRowSelectionEnabled ?
        [] :
        [
          {
            id: '__row_selection__',
            enableSorting: false,
            meta: {
              width: 44,
              minWidth: 44,
              maxWidth: 44,
              fixed: 'left',
              align: 'center',
              className: 'p-2',
              'data-testid': 'table-row-selection',
            },
            header: (ctx: { table: ReturnType<typeof useReactTable<TRecord>> }) => {
              const pageRows = ctx.table.getRowModel().rows
              const selectablePageIds = pageRows
                .filter((r) => {
                  const disabled = rowSelection?.getCheckboxProps?.(r.original)?.disabled
                  return !disabled
                })
                .map(r => r.id)

              const selectedOnPageCount = selectablePageIds.reduce((acc, id) => (selectedRowKeySet.has(id) ? acc + 1 : acc), 0)
              const isAllPageSelected = selectablePageIds.length > 0 && selectedOnPageCount === selectablePageIds.length
              const isSomePageSelected = selectedOnPageCount > 0 && !isAllPageSelected
              const pageChecked: boolean | 'indeterminate' = isAllPageSelected ? true : isSomePageSelected ? 'indeterminate' : false

              const allKeys = (rowSelection?.allRowKeys ?? []).map(k => String(k))
              const effectiveAllIds = allKeys.length > 0 ? allKeys : selectablePageIds
              const selectedAllCount = effectiveAllIds.reduce((acc, id) => (selectedRowKeySet.has(id) ? acc + 1 : acc), 0)
              const isAllSelected = effectiveAllIds.length > 0 && selectedAllCount === effectiveAllIds.length
              const isSomeSelected = selectedAllCount > 0 && !isAllSelected
              const allChecked: boolean | 'indeterminate' = isAllSelected ? true : isSomeSelected ? 'indeterminate' : false

              const handleApplyKeys = (keysToApply: React.Key[], checked: boolean, type: 'page' | 'all') => {
                const next = checked ?
                    Array.from(new Map([...selectedRowKeys, ...keysToApply].map(k => [String(k), k])).values()) :
                    selectedRowKeys.filter(k => !new Set(keysToApply.map(x => String(x))).has(String(k)))

                if (!isRowSelectionControlled)
                  setInternalSelectedRowKeys(next)

                const selectedRows = ctx.table.getCoreRowModel().rows.filter(r => new Set(next.map(k => String(k))).has(r.id)).map(r => r.original)

                rowSelection?.onChange?.(next, selectedRows, { type })
              }

              const handlePageChange = (checkedValue: boolean | 'indeterminate') => {
                const checked = checkedValue === true
                const keysToApply = pageRows
                  .filter((r) => {
                    const disabled = rowSelection?.getCheckboxProps?.(r.original)?.disabled
                    return !disabled
                  })
                  .map(r => getRowKeyValue(r.original, r.index))
                handleApplyKeys(keysToApply, checked, 'page')
              }

              const handleAllChange = (checkedValue: boolean | 'indeterminate') => {
                const checked = checkedValue === true
                const keysToApply = (rowSelection?.allRowKeys?.length ? rowSelection.allRowKeys : pageRows.map(r => getRowKeyValue(r.original, r.index))) ?? []
                handleApplyKeys(keysToApply, checked, 'all')
              }

              const checkedValue = selectAllMode === 'all' ? allChecked : pageChecked
              const handleChange = selectAllMode === 'all' ? handleAllChange : handlePageChange
              const ariaLabel = selectAllMode === 'all' ? 'Выбрать все элементы' : 'Выбрать все строки на странице'
              const dataTestId = selectAllMode === 'all' ? 'table-select-all' : 'table-select-page'

              return (
                <Checkbox checked={checkedValue} onCheckedChange={handleChange} aria-label={ariaLabel} data-testid={dataTestId} />
              )
            },
            cell: (ctx: { row: { id: string, index: number, original: TRecord } }) => {
              const record = ctx.row.original
              const rowId = ctx.row.id
              const disabled = Boolean(rowSelection?.getCheckboxProps?.(record)?.disabled)
              const checked = selectedRowKeySet.has(rowId)

              const handleChange = (checkedValue: boolean | 'indeterminate') => {
                const nextChecked = checkedValue === true
                if (disabled)
                  return

                const keyValue = getRowKeyValue(record, ctx.row.index)
                const keyString = String(keyValue)
                const next = nextChecked ?
                    Array.from(new Map([...selectedRowKeys, keyValue].map(k => [String(k), k])).values()) :
                    selectedRowKeys.filter(k => String(k) !== keyString)

                if (!isRowSelectionControlled)
                  setInternalSelectedRowKeys(next)

                // selectedRows только по загруженным данным (текущему dataSource)
                // Комментарий: для "all" по серверу — используйте `allRowKeys` и храните выбранные ключи снаружи.
                rowSelection?.onChange?.(next, [record], { type: 'row' })
              }

              return (
                <div
                  className="flex items-center justify-center"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ')
                      return
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <Checkbox
                    disabled={disabled}
                    checked={checked}
                    onCheckedChange={handleChange}
                    aria-label={`Выбрать строку ${rowId}`}
                    data-testid={`table-select-row-${rowId}`}
                  />
                </div>
              )
            },
          },
        ]

    const dataDefs = columns.map((c, idx) => toColumnDef<TRecord>(c, idx))
    return [...selectionDef, ...dataDefs]
  }, [
    columns,
    isRowSelectionEnabled,
    isRowSelectionControlled,
    rowSelection,
    selectAllMode,
    selectedRowKeySet,
    selectedRowKeys,
    getRowKeyValue,
  ])

  const [sorting, setSorting] = useState<SortingState>(() => {
    const firstIdx = columns.findIndex(c => c.defaultSortOrder)
    const first = firstIdx >= 0 ? columns[firstIdx] : undefined
    const order = first?.defaultSortOrder as SortDirection | undefined
    const id = first ? columnKeyOf(first, firstIdx) : undefined
    if (!id || !order)
      return []
    return [{ id, desc: order === 'descend' }]
  })

  const handleSortingChange = (updater: SortingState | ((old: SortingState) => SortingState)) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater
    setSorting(next)

    const sorter = next[0]
    const order: SortDirection | undefined = sorter ? (sorter.desc ? 'descend' : 'ascend') : undefined
    const result: SorterResult<TRecord> = {
      columnKey: sorter?.id,
      field: sorter?.id,
      order,
      column: columns.find((c, idx) => columnKeyOf(c, idx) === sorter?.id),
    }

    onChange?.(undefined, undefined, result, { action: 'sort' })
  }

  const table = useReactTable({
    data: resolvedData,
    columns: columnDefs,
    state: { sorting },
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    enableSortingRemoval: true,
    ...(clientSort ? { getSortedRowModel: getSortedRowModel() } : {}),
    getRowId: rowKey ?
        (originalRow, index) => {
          if (typeof rowKey === 'function')
            return String(rowKey(originalRow))
          const v = (originalRow as Record<string, unknown>)?.[rowKey as string]
          return v != null ? String(v) : String(index)
        } :
      undefined,
  })

  const wrapperStyle: React.CSSProperties = useMemo(() => {
    const style: React.CSSProperties = {}
    if (scroll?.y != null)
      style.maxHeight = typeof scroll.y === 'number' ? `${scroll.y}px` : scroll.y
    return style
  }, [scroll?.y])

  const totalFixedWidth = useMemo(() => {
    return layoutColumns.reduce((acc, c) => {
      const w = typeof c.width === 'number' ? c.width : typeof c.minWidth === 'number' ? c.minWidth : 0
      return acc + w
    }, 0)
  }, [layoutColumns])

  const tableMinWidth = useMemo(() => {
    if (scroll?.x === 'max-content')
      return 'max-content'
    if (typeof scroll?.x === 'number')
      return `${scroll.x}px`
    if (typeof scroll?.x === 'string')
      return scroll.x
    if (totalFixedWidth > 0)
      return `${totalFixedWidth}px`
    // Комментарий: по требованию — таблица не должна ужиматься по окну вообще.
    // Даем ей натуральную ширину по контенту → будет скролл, а не “наезд”/сжатие.
    return 'max-content'
  }, [scroll?.x, totalFixedWidth])

  const enableHorizontalScroll = true
  const hasScroll = enableHorizontalScroll || scroll?.y != null
  // Комментарий: pagination пока не реализуем (как в вашем кейсе pagination={false} просто игнорируем)
  void pagination

  const scrollState = useTableScrollState(scrollRef, [
    layoutColumns,
    tableMinWidth,
    hasAnyFixedWidth,
    hasFixedColumns,
  ])

  return (
    <div
      className={cn(
        systemStyles && 'rounded-lg border border-default-background bg-background',
        hideStickyScrollbar && 'scrollbar-hide',
        className,
      )}
      aria-busy={loading}
    >
      <div
        ref={scrollRef}
        className={cn(
          'rounded-lg',
          hasScroll && 'overflow-auto',
          enableHorizontalScroll && 'overflow-x-auto',
          // Комментарий: скелетон сам по себе “приглушенный”, не затемняем весь контейнер.
          isLoading && 'select-none',
        )}
        style={wrapperStyle}
      >
        <table
          className={cn(
            // Комментарий: таблица не должна ужиматься по ширине окна → держим натуральную ширину
            // w-full чтобы не было пустого места справа, min-w-max чтобы не ужималась ниже контента
            'w-full min-w-max border-separate border-spacing-0',
            (hasAnyFixedWidth || hasFixedColumns || typeof tableMinWidth === 'string') && 'table-fixed',
            tableClassName,
          )}
          style={tableMinWidth ? { minWidth: tableMinWidth } : undefined}
        >
          <TableColGroup columns={layoutColumns} />

          {showHeader && (
            <TableHeader
              table={table}
              columns={columns}
              sorting={sorting}
              stickyHeader={stickyHeader}
              showSorterTooltip={showSorterTooltip}
              stickyOffsets={stickyOffsets}
              fixedShadowEdges={fixedShadowEdges}
              scrollState={scrollState}
            />
          )}

          {isLoading ?
              (
                <tbody>
                  <TableSkeleton
                    table={table}
                    rowsCount={skeletonRowsCount}
                    stickyOffsets={stickyOffsets}
                    fixedShadowEdges={fixedShadowEdges}
                    scrollState={scrollState}
                  />
                </tbody>
              ) :
              (
                <TableBody
                  table={table}
                  columnsCount={layoutColumns.length}
                  onRow={onRow}
                  locale={locale}
                  stickyOffsets={stickyOffsets}
                  fixedShadowEdges={fixedShadowEdges}
                  scrollState={scrollState}
                  highlightNewRows={highlightNewRows}
                  tbodyDataTestId={tbodyDataTestId}
                  rowDataTestId={rowDataTestId}
                />
              )}
        </table>
      </div>
    </div>
  )
}
