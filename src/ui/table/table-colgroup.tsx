import type { Column, TableRecord } from './table-types'

export interface TableColGroupProps<TRecord extends TableRecord = TableRecord> {
  columns: Column<TRecord>[]
}

export function TableColGroup<TRecord extends TableRecord = TableRecord>({ columns }: TableColGroupProps<TRecord>) {
  return (
    <colgroup>
      {columns.map((c, idx) => {
        const w = typeof c.width === 'number' ?
          c.width :
          typeof c.minWidth === 'number' ?
            c.minWidth :
            undefined
        const maxW = typeof c.maxWidth === 'number' ? c.maxWidth : undefined

        return (
          <col
            key={String(c.key ?? c.columnKey ?? c.dataIndex ?? idx)}
            style={typeof w === 'number' ?
                {
                  width: `${w}px`,
                  minWidth: `${w}px`,
                  maxWidth: typeof maxW === 'number' ? `${maxW}px` : `${w}px`,
                } :
              undefined}
          />
        )
      })}
    </colgroup>
  )
}
