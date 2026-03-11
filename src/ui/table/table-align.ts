import type { ColumnMeta } from './table-internal-types'

export function getTextAlignClass(align?: ColumnMeta['align']): string {
  if (align === 'center')
    return 'text-center'
  if (align === 'right')
    return 'text-right'
  return 'text-left'
}

export function getJustifyAlignClass(align?: ColumnMeta['align']): string {
  if (align === 'center')
    return 'justify-center'
  if (align === 'right')
    return 'justify-end'
  return 'justify-start'
}
