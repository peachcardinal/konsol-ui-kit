import type React from 'react'

import type { SortDirection } from './table-types'

export interface ColumnMeta {
  width?: number
  minWidth?: number
  maxWidth?: number
  className?: string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  headerStyle?: React.CSSProperties
  'data-testid'?: string
  defaultSortOrder?: SortDirection
  cellStyle?: (record: unknown, index: number) => React.CSSProperties | undefined
  cellClassName?: (record: unknown, index: number) => string | undefined
}

export interface ScrollState {
  hasOverflowX: boolean
  canScrollLeft: boolean
  canScrollRight: boolean
}

export interface StickyOffsets {
  left: Record<string, number>
  right: Record<string, number>
}

export interface FixedShadowEdges {
  lastLeftId: string | null
  firstRightId: string | null
}
