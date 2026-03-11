import type React from 'react'

import type { FixedShadowEdges, ScrollState, StickyOffsets } from './table-internal-types'
import type { Column, TableRecord } from './table-types'

export const SHADOW_LEFT = '4px 0 8px -6px rgba(0, 0, 0, 0.14)'
export const SHADOW_RIGHT = '-4px 0 8px -6px rgba(0, 0, 0, 0.14)'

export function mergeBoxShadow(base?: string, extra?: string): string | undefined {
  if (!extra)
    return base
  if (!base)
    return extra
  return `${base}, ${extra}`
}

export function getFixedShadowEdges<TRecord extends TableRecord>(columns: Column<TRecord>[], getId: (col: Column<TRecord>, idx: number) => string): FixedShadowEdges {
  let lastLeftId: string | null = null
  let firstRightId: string | null = null

  for (let i = 0; i < columns.length; i += 1) {
    const c = columns[i]
    if (c.fixed === 'left')
      lastLeftId = getId(c, i)
  }

  for (let i = 0; i < columns.length; i += 1) {
    const c = columns[i]
    if (c.fixed === 'right') {
      firstRightId = getId(c, i)
      break
    }
  }

  return { lastLeftId, firstRightId }
}

export function getStickyOffsets<TRecord extends TableRecord>(columns: Column<TRecord>[], getId: (col: Column<TRecord>, idx: number) => string): StickyOffsets {
  const left: Record<string, number> = {}
  const right: Record<string, number> = {}

  let accLeft = 0
  columns.forEach((c, idx) => {
    if (c.fixed !== 'left')
      return
    const id = getId(c, idx)
    left[id] = accLeft
    const w = typeof c.width === 'number' ? c.width : typeof c.minWidth === 'number' ? c.minWidth : 0
    accLeft += w
  })

  let accRight = 0
  for (let i = columns.length - 1; i >= 0; i -= 1) {
    const c = columns[i]
    if (c.fixed !== 'right')
      continue
    const id = getId(c, i)
    right[id] = accRight
    const w = typeof c.width === 'number' ? c.width : typeof c.minWidth === 'number' ? c.minWidth : 0
    accRight += w
  }

  return { left, right }
}

export function getStickyStyle(fixed: 'left' | 'right' | undefined, columnId: string, stickyOffsets: StickyOffsets): React.CSSProperties {
  if (fixed === 'left')
    return { left: `${stickyOffsets.left[columnId] ?? 0}px` }
  if (fixed === 'right')
    return { right: `${stickyOffsets.right[columnId] ?? 0}px` }
  return {}
}

export function getEdgeShadow(fixed: 'left' | 'right' | undefined, columnId: string, fixedShadowEdges: FixedShadowEdges, scrollState: ScrollState): string | undefined {
  if (fixed === 'left' && fixedShadowEdges.lastLeftId === columnId && scrollState.canScrollLeft)
    return SHADOW_LEFT
  if (fixed === 'right' && fixedShadowEdges.firstRightId === columnId && scrollState.canScrollRight)
    return SHADOW_RIGHT
  return undefined
}
