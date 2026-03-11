import React from 'react'

import { useComboboxPrimitiveContext } from '../combobox-primitive-context'
import { getInputClasses } from '../utils'

interface ComboboxInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'disabled' | 'placeholder'> {}

export const ComboboxInput = React.forwardRef<HTMLInputElement, ComboboxInputProps>(
  ({ ...props }, ref) => {
    const {
      size,
      fullWidth,
      disabled,
      placeholder,
      getInputProps,
    } = useComboboxPrimitiveContext()

    const inputProps = getInputProps()

    return (
      <input
        ref={ref}
        {...inputProps}
        {...props}
        value={inputProps.value || ''}
        disabled={disabled}
        placeholder={placeholder}
        className={getInputClasses(size, fullWidth, disabled)}
      />
    )
  },
)

ComboboxInput.displayName = 'ComboboxInput'
