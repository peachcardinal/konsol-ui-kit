import React from 'react'

import type { ListProps } from '../types'

export const List = React.forwardRef<HTMLDivElement, ListProps>(
  ({ children }, _ref) => {
    return <>{children}</>
  },
)

List.displayName = 'List'
