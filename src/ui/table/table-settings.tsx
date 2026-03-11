import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { Divider } from '../Divider'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover'
import { Typography } from '../Typography'

export interface TableSettingsControl {
  key: string
  title?: ReactNode
  enabled: boolean
  disabled?: boolean
  'data-testid'?: string
}

export interface TableSettingsProps {
  title?: string
  controls: TableSettingsControl[]
  onChange: (key: string, value: boolean) => void
  /** container test id */
  'data-testid'?: string
  /** trigger button test id */
  'data-testid-button'?: string
  /** tooltip text for trigger */
  tooltip?: string
}

export function TableSettings({
  title,
  controls,
  onChange,
  tooltip,
  'data-testid': dataTestId,
  'data-testid-button': dataTestIdButton,
}: TableSettingsProps) {
  const handleToggle = (key: string, enabled: boolean) => {
    onChange(key, enabled)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="text"
          size="md"
          iconOnly
          icon="SettingsIcon"
          aria-label={tooltip ?? 'Настройки таблицы'}
          tabIndex={0}
          data-testid={dataTestIdButton}
          title={tooltip}
        />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-72 rounded-lg border border-border bg-popover p-1 shadow-md"
      >
        {title && (
          <div className="px-3 pt-2">
            <Typography weight="bold">{title}</Typography>
            <Divider className="mt-2" />
          </div>
        )}

        <div className="flex flex-col" data-testid={dataTestId}>
          {controls.map((c) => {
            const handleChange = () => handleToggle(c.key, !c.enabled)

            return (
              <label
                key={c.key}
                className={cn(
                  'flex cursor-pointer gap-2 rounded px-3 py-[5px] hover:bg-muted',
                  c.disabled && 'cursor-not-allowed opacity-60 hover:bg-transparent',
                )}
                data-testid={c['data-testid']}
              >
                <Checkbox
                  disabled={c.disabled}
                  checked={c.enabled}
                  onCheckedChange={handleChange}
                />

                <Typography textColor={c.disabled ? 'secondary' : undefined}>
                  {c.title}
                </Typography>
              </label>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
