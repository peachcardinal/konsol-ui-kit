import React from 'react'

import { cn } from '@/lib/utils'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '../Command'
import { Input } from '../Input'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover'
import { Typography } from '../Typography'

export interface AutocompleteOption<T = string> {
  label: string
  value: string
  data?: T
}

interface AutocompleteProps<T = string> {
  options: AutocompleteOption<T>[]
  value: string
  onValueChange: (value: string, option?: AutocompleteOption<T>) => void
  onInputChange?: (text: string) => void
  placeholder?: string
  emptyMessage?: string | React.ReactNode
  className?: string
  disabled?: boolean
  renderOption?: (option: AutocompleteOption<T>) => React.ReactNode
  size?: 'md' | 'lg'
  label?: string
  caption?: string
  error?: string
}

export function Autocomplete<T = string>({
  options,
  value,
  onValueChange,
  placeholder = 'Поиск...',
  onInputChange,
  emptyMessage = 'Ничего не найдено',
  className,
  disabled = false,
  label,
  caption,
  error,
  renderOption,
  size = 'md',
}: AutocompleteProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(
    value ? options.find(option => option.value === value)?.label || '' : '',
  )
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filteredOptions = React.useMemo(() => {
    return options.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()),
    )
  }, [options, inputValue])

  React.useEffect(() => {
    if (value) {
      const option = options.find(option => option.value === value)
      setInputValue(option?.label || '')
    }
  }, [value])

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      const selected = options.find(option => option.value === selectedValue)
      if (selected) {
        onValueChange(selected.value, selected)
        setInputValue(selected.label)
      }
      setOpen(false)
    },
    [options, onValueChange],
  )

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
      onInputChange?.(e.target.value)
      setOpen(true)
    },
    [],
  )

  const handleInputClick = React.useCallback(() => {
    if (open) {
      setOpen(false)
    } else {
      setOpen(true)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [open])

  const handlePopoverOpenChange = React.useCallback((openState: boolean) => {
    setOpen(openState)
    if (openState) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [])

  return (
    <Popover open={open} onOpenChange={handlePopoverOpenChange}>
      <div className="relative">
        <PopoverTrigger asChild>
          <div className="w-full">
            {label && (
              <Typography
                variant="p3"
                weight="medium"
                className={cn('mb-1', {
                  'text-[14px]': size === 'md',
                  'text-[16px]': size === 'lg',
                })}
              >
                {label}
              </Typography>
            )}
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
              onClick={handleInputClick}
              className={cn('w-full', className)}
              disabled={disabled}
              size={size}
            />
            {caption && (
              <Typography variant="p1" className="mt-1" textColor="secondary">
                {caption}
              </Typography>
            )}
            {error && (
              <Typography variant="p2" className="mt-1" textColor="destructive">
                {error}
              </Typography>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    className="flex flex-col items-start py-2"
                  >
                    {renderOption ?
                        (
                          renderOption(option)
                        ) :
                        (
                          <div>{option.label}</div>
                        )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  )
}
