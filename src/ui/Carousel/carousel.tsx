import React from 'react'

import type { EmblaOptionsType } from 'embla-carousel'

import useEmblaCarousel from 'embla-carousel-react'

import { cn } from '@/lib/utils'

interface SimpleCarouselProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  items: T[]
  renderSlide: (item: T, index: number) => React.ReactNode
  options?: EmblaOptionsType
  className?: string
  slideClassName?: string
}

export function SimpleCarousel<T>({
  items,
  renderSlide,
  options,
  className,
  slideClassName,
  ...divProps
}: SimpleCarouselProps<T>) {
  const emblaOptions = {
    align: 'center',
    loop: false,
  } as const
  const [emblaRef] = useEmblaCarousel(emblaOptions)

  return (
    <div
      ref={emblaRef}
      className={cn('relative overflow-visible px-4', className)}
      {...divProps}
    >
      <div className="flex touch-pan-x select-none">
        {items.map((item, idx) => (
          <div key={idx} className={cn('flex-shrink-0 px-2', slideClassName)}>
            {renderSlide(item, idx)}
          </div>
        ))}
      </div>
    </div>
  )
}
