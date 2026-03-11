import React, { useCallback } from 'react'

import { cn } from '@/lib/utils'

import { useComboboxPrimitiveContext } from '../combobox-primitive-context'
import { getContainerClasses, hasError } from '../utils'

interface ComboboxContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ComboboxContainer = React.forwardRef<HTMLDivElement, ComboboxContainerProps>(
  ({ children, className, ...props }, ref) => {
    const {
      size,
      fullWidth,
      transparent,
      disabled,
      error,
      isOpen,
      refs,
    } = useComboboxPrimitiveContext()

    const setRef = useCallback((node: HTMLDivElement | null) => {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
      // Устанавливаем reference только если node изменился и не равен null
      if (refs.reference.current !== node && node !== null) {
        refs.setReference(node)
      }
    }, [ref, refs])

    return (
      <div
        ref={setRef}
        className={cn(
          getContainerClasses(size, fullWidth, transparent, disabled, hasError(error)),
          className,
        )}
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        {children}
      </div>
    )
  },
)

ComboboxContainer.displayName = 'ComboboxContainer'
