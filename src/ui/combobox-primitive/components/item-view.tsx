import React from 'react'

import type { ItemViewProps } from '../types'

import { getItemClasses } from '../utils'

export const ItemView = React.forwardRef<HTMLDivElement, ItemViewProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ children, isSelected, className, ...itemProps }, ref) => {
    if (typeof children === 'function') {
      return (
        <div
          ref={ref}
          {...itemProps}
          className={getItemClasses(isSelected, className)}
        >
          {children({
            isSelected,
            className: getItemClasses(isSelected, className),
            ...itemProps,
          })}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        {...itemProps}
        className={getItemClasses(isSelected, className)}
      >
        {children}
      </div>
    )
  },
)

ItemView.displayName = 'ItemView'
