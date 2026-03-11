import React, { useCallback } from 'react'

import { cn } from '@/lib/utils'

import { getFloatingMenuClasses } from '../../combobox-primitive/utils'
import { useComboboxMultiSelectContext } from '../combobox-multiselect-context'

interface ComboboxMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const ComboboxMenu = React.forwardRef<HTMLDivElement, ComboboxMenuProps>(
  ({ children, className, ...props }, ref) => {
    const {
      isMounted,
      getMenuProps,
      refs,
      floatingStyles,
      transitionStyles,
    } = useComboboxMultiSelectContext()

    const hasItems = React.Children.count(children) > 0

    const setFloatingRef = useCallback((node: HTMLElement | null): void => {
      if (typeof ref === 'function') {
        ref(node as HTMLDivElement)
      } else if (ref) {
        ref.current = node as HTMLDivElement
      }
      // Устанавливаем floating reference только если node изменился и не равен null
      if (refs.floating.current !== node && node !== null) {
        refs.setFloating(node)
      }
    }, [ref, refs])

    return (
      <div
        {...getMenuProps({
          ref: setFloatingRef,
        })}
        style={{ ...floatingStyles, ...transitionStyles }}
        className={cn(getFloatingMenuClasses(isMounted, hasItems), className)}
        data-state={isMounted ? 'open' : 'closed'}
        {...props}
      >
        {isMounted && children}
      </div>
    )
  },
)

ComboboxMenu.displayName = 'ComboboxMenu'
