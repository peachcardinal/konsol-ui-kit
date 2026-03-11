import type React from 'react'
import { useEffect, useState } from 'react'

import type { ScrollState } from './table-internal-types'

const INITIAL: ScrollState = {
  hasOverflowX: false,
  canScrollLeft: false,
  canScrollRight: false,
}

export function useTableScrollState(scrollRef: React.RefObject<HTMLElement | null>, deps: React.DependencyList): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>(INITIAL)

  useEffect(() => {
    const el = scrollRef.current
    if (!el)
      return

    const update = () => {
      const maxScrollLeft = el.scrollWidth - el.clientWidth
      const hasOverflowX = maxScrollLeft > 1
      const canScrollLeft = el.scrollLeft > 1
      const canScrollRight = el.scrollLeft < maxScrollLeft - 1

      setScrollState((prev) => {
        if (
          prev.hasOverflowX === hasOverflowX &&
          prev.canScrollLeft === canScrollLeft &&
          prev.canScrollRight === canScrollRight
        ) {
          return prev
        }
        return { hasOverflowX, canScrollLeft, canScrollRight }
      })
    }

    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [scrollRef, ...deps])

  return scrollState
}
