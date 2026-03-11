import React from 'react'
import type { Props as InputMaskProps } from 'react-input-mask'
import ReactInputMask from 'react-input-mask'

import type { ComponentPropsWithoutRef } from 'react'

import { Input } from '../Input'

type InputProps = ComponentPropsWithoutRef<typeof Input>

const InputMask =
  ReactInputMask as unknown as React.ComponentType<InputMaskProps>

export interface MaskedInputProps extends Omit<InputProps, 'onChange'> {
  mask: string
  maskChar?: string | null
  alwaysShowMask?: boolean
  maskPlaceholder?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  currentCountry?: unknown
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    {
      className,
      containerClassName,
      mask,
      maskChar = null,
      alwaysShowMask = false,
      maskPlaceholder = null,
      onChange,
      size = 'md',
      currentCountry,
      ...props
    },
    ref,
  ) => {
    const localRef = React.useRef<HTMLInputElement>(null)
    React.useImperativeHandle(ref, () => localRef.current as HTMLInputElement)

    // const handlePaste = React.useCallback(
    //   (e: React.ClipboardEvent<HTMLInputElement>) => {
    //     e.preventDefault()
    //     if (props.type === 'tel') {
    //       const pastedText = e.clipboardData.getData('text')
    //       const digits = normalizePhoneInput(pastedText)

    //       if (localRef.current && digits) {
    //         const input = localRef.current
    //         const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    //           window.HTMLInputElement.prototype,
    //           'value',
    //         )?.set

    //         if (nativeInputValueSetter) {
    //           nativeInputValueSetter.call(input, digits)

    //           const inputEvent = new Event('input', { bubbles: true })
    //           input.dispatchEvent(inputEvent)
    //         }
    //       }
    //     }
    //   },
    //   [onChange],
    // )
    return (
      <InputMask
        mask={mask}
        maskChar={maskChar}
        alwaysShowMask={alwaysShowMask}
        maskPlaceholder={maskPlaceholder}
        onChange={onChange}
        {...props}
      >
        {({ ...p }: InputProps) => {
          return (
            <Input
              {...p}
              {...props}
              size={size}
              ref={localRef}
              className={className}
              containerClassName={containerClassName}
            />
          )
        }}
      </InputMask>
    )
  },
)

MaskedInput.displayName = 'MaskedInput'

export { MaskedInput }
