import React from 'react'

import type { ComboboxPrimitiveItem } from './types'

// Type guard для проверки React компонентов
function isComponentWithDisplayName(component: any, displayName: string): boolean {
  return (
    component &&
    typeof component === 'object' &&
    component.displayName === displayName
  )
}

/**
 * Хук для извлечения элементов из children
 */
export function useComboboxItems<T>(
  children: React.ReactNode,
  getLabel: (value: T) => string,
) {
  const arrayChildren = React.Children.toArray(children)

  const listElements = arrayChildren.filter((child) => {
    if (!React.isValidElement(child))
      return false
    return isComponentWithDisplayName(child.type, 'List')
  })

  const allListChildren: React.ReactNode[] = []

  listElements.forEach((listElement) => {
    if (React.isValidElement(listElement)) {
      const listChildren = React.Children.toArray(listElement.props.children)
      allListChildren.push(...listChildren)
    }
  })

  if (!listElements.length) {
    return { items: [] }
  }

  const extractedItems: ComboboxPrimitiveItem<T>[] = []

  allListChildren.forEach((child) => {
    if (!React.isValidElement(child)) {
      return
    }

    const isItemComponent = isComponentWithDisplayName(child.type, 'Item')

    if (isItemComponent) {
      try {
        const itemValue = child.props.option
        const itemLabel = getLabel(child.props.option)

        extractedItems.push({
          value: itemValue,
          label: itemLabel,
        })
      } catch {
        // Тихо обрабатываем ошибку, можно добавить логирование при необходимости
      }
    }
  })

  return { items: extractedItems }
}
