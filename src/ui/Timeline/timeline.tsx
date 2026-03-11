import React from 'react'

import { cn } from '@/lib/utils'

import { Typography } from '../Typography'

export type TypographyVariant = 'p1' | 'p2' | 'p3' | 'p4'
export type TypographyWeight = 'normal' | 'medium' | 'bold'

export interface TimelineItem {
  title: React.ReactNode
  subtitle?: React.ReactNode
  additionalText?: React.ReactNode
  date?: React.ReactNode
  active?: boolean
  titleVariant?: TypographyVariant
  subtitleVariant?: TypographyVariant
  titleWeight?: TypographyWeight
}

export interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export const Timeline: React.FC<TimelineProps> = ({ items, className }) => {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index} className="flex">
          <div className="relative mr-4 flex flex-col items-center">
            <div
              className={cn(
                'flex-shrink-0 rounded-full',
                'h-2.5 w-2.5 border-2 bg-white',
                item.active ? 'border-primary' : 'border-border',
              )}
            />

            {index < items.length - 1 && (
              <div className="border-border-timeline w-0 flex-1 border-l-2" />
            )}
          </div>

          <div className="-mt-[5px] flex-1 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Typography
                  variant={item.titleVariant}
                  weight={item.titleWeight}
                >
                  {item.title}
                </Typography>
                {item.additionalText && (
                  <Typography textColor="secondary">
                    {item.additionalText}
                  </Typography>
                )}
                {item.subtitle && (
                  <Typography variant={item.subtitleVariant}>
                    {item.subtitle}
                  </Typography>
                )}
              </div>
              {item.date && (
                <Typography className="text-right">{item.date}</Typography>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
