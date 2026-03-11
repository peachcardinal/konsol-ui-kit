import { cn } from '@/lib/utils'

import { Card } from '../card'

export interface TableCardsSkeletonProps {
  rowsCount: number
  linesCount: number
  className?: string
}

export function TableCardsSkeleton({
  rowsCount,
  linesCount,
  className,
}: TableCardsSkeletonProps) {
  const safeRowsCount = Math.max(1, Math.floor(rowsCount))
  const safeLinesCount = Math.max(1, Math.floor(linesCount))

  const getWidth = (min: number, max: number, seed: number) => {
    const span = Math.max(0, max - min)
    return `${min + (seed % (span + 1))}%`
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {Array.from({ length: safeRowsCount }).map((_, cardIndex) => (
        <Card
          key={`card_skeleton_${cardIndex}`}
          bordered
          radius="lg"
          padding="xs"
          className="animate-pulse"
          role="status"
          aria-label="Загрузка карточки"
        >
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full items-start justify-between gap-3">
              <div
                className="h-4 rounded bg-muted"
                style={{ width: getWidth(35, 60, cardIndex * 13) }}
              />
              <div
                className="h-4 rounded bg-muted"
                style={{ width: getWidth(18, 28, cardIndex * 17) }}
              />
            </div>

            <div className="h-px w-full bg-default-background/70" />

            <div className="flex w-full flex-col gap-2">
              {Array.from({ length: safeLinesCount }).map((__, lineIndex) => (
                <div
                  key={`card_skeleton_${cardIndex}_${lineIndex}`}
                  className="flex w-full items-center justify-between gap-3"
                >
                  <div
                    className="h-3 rounded bg-muted"
                    style={{ width: getWidth(22, 38, cardIndex * 19 + lineIndex * 7) }}
                  />
                  <div
                    className="h-3 rounded bg-muted"
                    style={{ width: getWidth(30, 62, cardIndex * 23 + lineIndex * 11) }}
                  />
                </div>
              ))}
            </div>

            <div className="flex w-full items-center justify-end gap-2 pt-1">
              <div
                className="h-6 rounded-full bg-muted"
                style={{ width: getWidth(18, 26, cardIndex * 29) }}
              />
              <div
                className="h-6 rounded-full bg-muted"
                style={{ width: getWidth(12, 20, cardIndex * 31) }}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
