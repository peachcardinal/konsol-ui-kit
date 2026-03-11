import type React from 'react'

export type SortDirection = 'ascend' | 'descend'
export type SortOrder = SortDirection | undefined

export type TableRecord = Record<string, unknown>

export type TableRowSelectionMode = 'page' | 'all'

export interface TableRowSelectionChangeInfo {
  type: 'row' | 'page' | 'all'
}

export interface TableRowSelectionCheckboxProps {
  disabled?: boolean
  'data-testid'?: string
}

/**
 * antd-like rowSelection.
 *
 * Важно:
 * - `selectedRowKeys` / `defaultSelectedRowKeys` хранят ключи как React.Key (number/string).
 * - Сравнение внутри таблицы идёт по `String(key)`, чтобы корректно поддерживать любые типы.
 * - Для "выбрать все элементы" (по всем страницам/всему датасету) используйте `allRowKeys`.
 */
export interface TableRowSelection<TRecord extends TableRecord = TableRecord> {
  /** Контролируемый список ключей выбранных строк */
  selectedRowKeys?: React.Key[]
  /** Неконтролируемый список ключей выбранных строк */
  defaultSelectedRowKeys?: React.Key[]

  /** Коллбек на любые изменения выбора */
  onChange?: (selectedRowKeys: React.Key[], selectedRows: TRecord[], info: TableRowSelectionChangeInfo) => void

  /** Отключение выбора для конкретных строк */
  getCheckboxProps?: (record: TRecord) => TableRowSelectionCheckboxProps

  /**
   * Режим поведения единственного чекбокса в заголовке (выбрать всё):
   * - `page`: только текущие (видимые) строки
   * - `all`: все элементы из `allRowKeys` (если не передано — fallback на page)
   */
  selectAllMode?: TableRowSelectionMode

  /**
   * @deprecated Используйте `selectAllMode`.
   * Временно оставлено для совместимости.
   */
  selectAllScope?: 'page' | 'all' | 'both'

  /**
   * Полный список ключей по всему датасету (например, по всем страницам).
   * Нужен, когда ваша таблица получает уже пагинированные данные.
   */
  allRowKeys?: React.Key[]
}

export interface SorterResult<TRecord extends TableRecord = TableRecord> {
  columnKey?: string
  field?: string
  order?: SortDirection
  column?: Column<TRecord>
}

export type TableChangeSorter<TRecord extends TableRecord = TableRecord> =
  | SorterResult<TRecord>
  | SorterResult<TRecord>[]

export interface TableChangeExtra {
  action: 'sort' | 'paginate' | 'filter'
}

export type TableOnChange<TRecord extends TableRecord = TableRecord> = (
  pagination: unknown,
  filters: unknown,
  sorter: TableChangeSorter<TRecord>,
  extra: TableChangeExtra,
) => void

export interface SortColumn<TRecord extends TableRecord = TableRecord> {
  column: Pick<Column<TRecord>, 'dataIndex' | 'key' | 'columnKey'>
  order?: SortDirection
}

export interface ColumnTitleProps<TRecord extends TableRecord = TableRecord> {
  sortColumns?: SortColumn<TRecord>[]
}

export type ColumnTitle<TRecord extends TableRecord = TableRecord> =
  | React.ReactNode
  | ((props: ColumnTitleProps<TRecord>) => React.ReactNode)

export interface Column<TRecord extends TableRecord = TableRecord> {
  key?: React.Key
  /** antd-like: columnKey */
  columnKey?: string
  dataIndex?: string | string[]

  title?: ColumnTitle<TRecord>

  width?: number
  minWidth?: number
  maxWidth?: number
  className?: string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'

  sorter?: boolean
  defaultSortOrder?: SortDirection

  onHeaderCell?: () => { style?: React.CSSProperties }
  onCell?: (record: TRecord, index: number) => { style?: React.CSSProperties, className?: string }

  render?: (value: unknown, record: TRecord, index: number) => React.ReactNode

  /** extra passthrough */
  'data-testid'?: string
}

// Комментарий: алиас под main-app naming (как у тебя было: type { Column as TableColumn })
export type TableColumn<TRecord extends TableRecord = TableRecord> = Column<TRecord>

export interface TableScroll {
  x?: number | string
  y?: number | string
}

export interface TableProps<TRecord extends TableRecord = TableRecord> {
  columns: Column<TRecord>[]
  dataSource?: TRecord[]

  /** alias, чтобы было удобно в storybook */
  data?: TRecord[]

  loading?: boolean
  /** Кол-во строк скелетона при loading=true */
  loadingRows?: number
  className?: string
  systemStyles?: boolean
  hideStickyScrollbar?: boolean

  scroll?: TableScroll
  stickyHeader?: boolean
  /** Если true — подсвечиваем появление новых строк */
  highlightNewRows?: boolean

  /** antd-like */
  rowKey?: keyof TRecord | ((record: TRecord) => React.Key)
  /** antd-like */
  rowSelection?: TableRowSelection<TRecord>
  pagination?: false | unknown
  showHeader?: boolean
  showSorterTooltip?: boolean

  /** antd-like */
  onRow?: (
    record: TRecord,
    index: number,
  ) => React.HTMLAttributes<HTMLTableRowElement> & { 'data-testid'?: string }

  /** antd-like */
  locale?: {
    /**
     * Legacy API: кастомный ReactNode для пустого состояния.
     * Если задан — будет отрисован как есть (вместо emptyTitle/emptyDescription).
     */
    emptyText?: React.ReactNode
    /** Заголовок пустого состояния (по умолчанию: "Всё чисто") */
    emptyTitle?: React.ReactNode
    /** Описание пустого состояния (по умолчанию: "Добавьте что-нибудь, чтобы начать работу") */
    emptyDescription?: React.ReactNode
  }

  onChange?: TableOnChange<TRecord>
}
