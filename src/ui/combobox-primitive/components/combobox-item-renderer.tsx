import React from 'react'

import type { ItemProps } from '../types'

import { cn } from '@/lib/utils'

import { ScrollArea } from '../../ScrollArea'
import { useComboboxPrimitiveContext } from '../combobox-primitive-context'
import { ItemView } from './item-view'

interface ComboboxItemRendererProps {
  children: React.ReactNode
  classNames?: {
    scrollAreaViewport?: string
    scrollArea?: string
  }
}

// Utility function для безопасного сравнения значений (зарезервировано для будущего использования)

// Type guard для проверки React компонентов
function isComponentWithDisplayName(component: any, displayName: string): boolean {
  return (
    component &&
    typeof component === 'object' &&
    component.displayName === displayName
  )
}

// Функция для создания уникального ключа элемента
function createItemKey<T>(value: T): string {
  if (value === null || value === undefined) {
    return String(value)
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }

  return String(value)
}

function ComboboxItemRendererComponent<T extends object>({
  children,
  classNames,
}: ComboboxItemRendererProps): React.ReactElement {
  const { items, selectedItem, getItemProps } = useComboboxPrimitiveContext<T>()

  // Создаем индекс элементов для поиска
  const itemsMap = new Map<string, { item: any, index: number }>()
  items.forEach((item, index) => {
    const key = createItemKey(item.value)
    itemsMap.set(key, { item, index })
  })

  // Получаем ключ выбранного элемента
  const selectedItemKey = selectedItem ? createItemKey(selectedItem.value) : null

  const renderChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child, _childIndex) => {
      if (!React.isValidElement(child)) {
        return child
      }

      // Используем type guard для безопасной проверки типа
      if (isComponentWithDisplayName(child.type, 'List')) {
        const listChildren = React.Children.map(child.props.children, (listChild, _listChildIndex) => {
          if (!React.isValidElement(listChild)) {
            return listChild
          }

          // Используем type guard для безопасной проверки типа Item
          if (isComponentWithDisplayName(listChild.type, 'Item')) {
            try {
              const itemProps = listChild.props as ItemProps<T>
              const itemKey = createItemKey(itemProps.option)

              const itemData = itemsMap.get(itemKey)

              if (itemData) {
                const { item, index: itemIndex } = itemData
                const isSelected = selectedItemKey === itemKey

                return (
                  <ItemView
                    key={itemKey}
                    isSelected={isSelected}
                    className={itemProps.className}
                    {...getItemProps({
                      item,
                      index: itemIndex,
                    })}
                  >
                    {typeof itemProps.children === 'function' ?
                        itemProps.children({
                          isSelected,
                          className: itemProps.className,
                          ...getItemProps({
                            item,
                            index: itemIndex,
                          }),
                        }) :
                      itemProps.children}
                  </ItemView>
                )
              }
            } catch {
              return null
            }
          }

          // Остальные элементы внутри List остаются без изменений
          return listChild
        })

        const componentList = (
          <ScrollArea
            className={cn('flex max-h-60 flex-col', classNames?.scrollArea)}
            relative={false}
            viewPortClassName={cn('!flex flex-col', classNames?.scrollAreaViewport)}
            asChild={true}
          >
            {listChildren}
          </ScrollArea>
        )

        return React.cloneElement(child, child.props, componentList)
      }

      // Остальные компоненты остаются без изменений
      return child
    })
  }

  const result = renderChildren(children)
  return <>{result}</>
}

export const ComboboxItemRenderer = ComboboxItemRendererComponent as <_T>(
  props: ComboboxItemRendererProps
) => React.ReactElement

// Устанавливаем displayName для отладки
Object.defineProperty(ComboboxItemRenderer, 'displayName', {
  value: 'ComboboxItemRenderer',
  writable: false,
})
