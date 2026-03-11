import React from 'react'

import type { ItemProps } from '../types'

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ children }, _ref) => {
    return <>{children}</>
  },
)
Item.displayName = 'Item'
