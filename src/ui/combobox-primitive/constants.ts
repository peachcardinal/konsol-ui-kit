import type { ComboboxPrimitiveSize } from './types'

export const SIZE_CONFIG = {
  xs: {
    height: 'h-6',
    fontSize: 'text-[12px]',
    iconSize: 12,
    paddingLeft: 'pl-1.5',
    paddingRight: 'pr-2',
    labelSize: 'text-[12px]',
  },
  sm: {
    height: 'h-8',
    fontSize: 'text-[14px]',
    iconSize: 14,
    paddingLeft: 'pl-2',
    paddingRight: 'pr-3',
    labelSize: 'text-[14px]',
  },
  md: {
    height: 'h-9',
    fontSize: 'text-[14px]',
    iconSize: 16,
    paddingLeft: 'pl-2',
    paddingRight: 'pr-3',
    labelSize: 'text-[14px]',
  },
  lg: {
    height: 'h-10 rounded-xl',
    fontSize: 'text-[14px]',
    iconSize: 24,
    paddingLeft: 'pl-2',
    paddingRight: 'pr-3',
    labelSize: 'text-[14px]',
  },
} as const

export function getIconSize(size: ComboboxPrimitiveSize): number {
  return SIZE_CONFIG[size].iconSize
}

export const ITEM_BASE_STYLES = [
  'font-graphik',
  'relative',
  'flex',
  'w-full',
  'cursor-pointer',
  'items-center',
  'rounded-md',
  'px-3',
  'mx-0.5',
  'transition-colors',
  'outline-none',
  'select-none',
  'p-3',
] as const

export const ITEM_SELECTED_STYLES = [
  'bg-primary-10',
  'font-medium',
  'hover:bg-[#F3E5FF]',
] as const

export const ITEM_HOVER_STYLES = [
  'hover:bg-muted',
] as const

export const ITEM_HIGHLIGHTED_STYLES = [
  'data-[highlighted]:bg-primary-10',
  'data-[highlighted]:font-medium',
] as const

export const INPUT_BASE_STYLES = [
  'font-graphik',
  'flex-1',
  'border-0',
  'bg-transparent',
  'py-1',
  'focus:outline-none',
  'disabled:cursor-not-allowed',
  '[&::-webkit-inner-spin-button]:appearance-none',
  '[&::-webkit-outer-spin-button]:appearance-none',
  'placeholder:text-muted-foreground',
] as const

export const CONTAINER_BASE_STYLES = [
  'relative',
  'flex',
  'items-center',
  'rounded-lg',
  'border-1',
  'border-solid',
] as const

export const CONTAINER_NORMAL_STYLES = [
  'bg-background',
  'border-border',
  'hover:border-primary',
  'focus-within:border-primary',
  'focus-within:shadow-focus',
  'disabled:hover:border-border',
  'disabled:focus-within:border-border',
  'disabled:focus-within:shadow-none',
  'disabled:hover:border-none',
] as const

export const CONTAINER_ERROR_STYLES = [
  'bg-background',
  'border-destructive',
  'hover:border-destructive',
  'focus-within:border-destructive',
  'focus-within:shadow-error',
] as const

export const CONTAINER_DISABLED_STYLES = [
  'bg-muted',
  'cursor-not-allowed',
] as const

export const CONTAINER_TRANSPARENT_STYLES = [
  'border-0',
  'bg-transparent',
  'hover:bg-transparent',
  'focus-within:border-0',
  'focus-within:shadow-none',
] as const

export const FLOATING_MENU_STYLES = [
  'bg-popover',
  'text-popover-foreground',
  'border-border',
  'z-50',
  'max-h-80',
  'overflow-hidden',
  'rounded-lg',
  'border',
  'shadow-lg',
] as const
