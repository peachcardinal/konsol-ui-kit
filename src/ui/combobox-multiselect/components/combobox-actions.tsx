import React from 'react'

import { cn } from '@/lib/utils'

import { Icon } from '../../../icon'
import { getIconSize } from '../../combobox-primitive/constants'
import { Spinner } from '../../spinner'
import { useComboboxMultiSelectContext } from '../combobox-multiselect-context'

interface ComboboxActionsProps {}

export const ComboboxActions: React.FC<ComboboxActionsProps> = () => {
  const {
    size,
    transparent,
    isOpen,
    error,
    getToggleButtonProps,
    loading,
    disabled,
  } = useComboboxMultiSelectContext()

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
