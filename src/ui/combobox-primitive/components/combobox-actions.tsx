import React from 'react'

import { cn } from '@/lib/utils'

import { Button } from '../../button'
import { Icon } from '../../Icon'
import { Spinner } from '../../Spinner'
import { useComboboxPrimitiveContext } from '../combobox-primitive-context'
import { getIconSize } from '../constants'

interface ComboboxActionsProps {}

export const ComboboxActions: React.FC<ComboboxActionsProps> = () => {
  const {
    size,
    transparent,
    isOpen,
    error,
    getToggleButtonProps,
    loading,
    onClear,
    clearable,
    selectedItem,
    disabled,
  } = useComboboxPrimitiveContext()

  return (
    <div className="flex items-center gap-1.5 pr-2">
      {loading ?
          (
            <Spinner size={12} />
          ) :
          (
            <>
              {error && (
                <Icon
                  icon="InfoFillIcon"
                  className="!text-destructive"
                  size={16}
                />
              )}

              {clearable && selectedItem && (
                <Button
                  type="button"
                  variant="text"
                  icon="CloseIcon"
                  size="custom"
                  className="rounded-full p-[2px] text-secondary"
                  iconOnly
                  disabled={disabled}
                  onClick={() => {
                    onClear?.()
                  }}
                />
              )}

              <button type="button" className="cursor-pointer inline-flex items-center justify-center bg-transparent border-none focus:outline-none p-0" {...getToggleButtonProps({ disabled })}>
                <Icon
                  icon="ArrowDownIcon"
                  className={cn(
                    'text-muted-foreground transition-transform',
                    transparent && 'pl-1',
                    isOpen && 'rotate-180',
                  )}
                  size={getIconSize(size) as 8 | 12 | 14 | 16 | 24 | 20 | 48 | 96}
                />
              </button>
            </>
          )}

    </div>
  )
}

ComboboxActions.displayName = 'ComboboxActions'
