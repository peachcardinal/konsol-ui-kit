import type { ComboboxPrimitiveSize } from './types'

import { cn } from '@/lib/utils'

import {
  CONTAINER_BASE_STYLES,
  CONTAINER_DISABLED_STYLES,
  CONTAINER_ERROR_STYLES,
  CONTAINER_NORMAL_STYLES,
  CONTAINER_TRANSPARENT_STYLES,
  FLOATING_MENU_STYLES,
  INPUT_BASE_STYLES,
  ITEM_BASE_STYLES,
  ITEM_HIGHLIGHTED_STYLES,
  ITEM_HOVER_STYLES,
  ITEM_SELECTED_STYLES,
  SIZE_CONFIG,
} from './constants'

/**
 * Генерирует CSS классы для элементов списка
 */
export function getItemClasses(isSelected: boolean, className?: string): string {
  return cn(
    ...ITEM_BASE_STYLES,
    isSelected ? ITEM_SELECTED_STYLES : ITEM_HOVER_STYLES,
    ...ITEM_HIGHLIGHTED_STYLES,
    className,
  )
}

/**
 * Генерирует CSS классы для input элемента
 */
export function getInputClasses(size: ComboboxPrimitiveSize, fullWidth: boolean, disabled: boolean): string {
  const sizeConfig = SIZE_CONFIG[size]

  return cn(
    ...INPUT_BASE_STYLES,
    sizeConfig.fontSize,
    sizeConfig.paddingLeft,
    sizeConfig.paddingRight,
    {
      'w-full': fullWidth,
      'text-muted-foreground': disabled,
    },
  )
}

/**
 * Генерирует CSS классы для контейнера
 */
export function getContainerClasses(
  size: ComboboxPrimitiveSize,
  fullWidth: boolean,
  transparent: boolean,
  disabled: boolean,
  hasError: boolean,
): string {
  const sizeConfig = SIZE_CONFIG[size]

  return cn(
    ...CONTAINER_BASE_STYLES,
    sizeConfig.height,
    {
      'w-full': fullWidth,
    },
    // Стили в зависимости от состояния
    !disabled && !transparent && !hasError && CONTAINER_NORMAL_STYLES,
    disabled && !transparent && [
      'bg-background',
      'border-border',
      ...CONTAINER_DISABLED_STYLES,
    ],
    hasError && !disabled && !transparent && CONTAINER_ERROR_STYLES,
    transparent && CONTAINER_TRANSPARENT_STYLES,
  )
}

/**
 * Генерирует CSS классы для лейбла
 */
export function getLabelClasses(size: ComboboxPrimitiveSize): string {
  const sizeConfig = SIZE_CONFIG[size]

  return cn('mb-1.5', sizeConfig.labelSize)
}

/**
 * Генерирует CSS классы для floating меню
 */
export function getFloatingMenuClasses(isMounted: boolean, hasItems: boolean): string {
  return cn('hidden', isMounted && FLOATING_MENU_STYLES, hasItems && 'flex flex-col gap-2')
}

/**
 * Определяет есть ли ошибка
 */
export function hasError(error?: string): boolean {
  return error !== undefined && error !== null && error !== ''
}
