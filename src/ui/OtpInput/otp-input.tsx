import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { cn } from '@/lib/utils'

import { Input } from '../Input'
import { Link } from '../Link'
import { Typography } from '../Typography'

const BACKSPACE = 8
const LEFT_ARROW = 37
const RIGHT_ARROW = 39
const DELETE = 46
const SPACEBAR = 32

export interface OTPInput {
  length?: number
  title?: string
  fnGetCode?: () => void
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  isDisabled?: boolean
  loading?: boolean
  enableClearOnComplete?: boolean
  masked?: boolean
  hasError?: boolean
  errorMessage?: string
  'data-testid'?: string
  'data-cy'?: string
  smsTexts?: {
    resend: string
    sms: string
  }
  timer?: number
}

type AndroidInputEvent = React.FormEvent<HTMLInputElement> & {
  nativeEvent: {
    data: string | null
    inputType: string
  }
}

export interface SingleOtpInput {
  className?: string
  hasErrored?: boolean
  isDisabled?: boolean
  loading?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onInput: (e: AndroidInputEvent) => void
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur: () => void
  value?: string
  'data-testid'?: string
  'data-cy'?: string
  index: number
  focus: boolean
  masked?: boolean
}

function SingleOtpInputComponent(props: SingleOtpInput) {
  const {
    focus,
    isDisabled,
    loading,
    index,
    value,
    className,
    masked,
    ...rest
  } = props
  const input = useRef<HTMLInputElement>(null)

  // Focus on first render
  useEffect(() => {
    const { current: inputEl } = input
    if (inputEl && focus && !isDisabled && !loading) {
      // Используем requestAnimationFrame для гарантированного выполнения после рендера
      requestAnimationFrame(() => {
        inputEl.focus()
        // Для мобильных устройств добавляем дополнительный click
        inputEl.click()
      })
    }
  }, [])

  useEffect(() => {
    const { current: inputEl } = input
    if (focus && inputEl && !loading) {
      requestAnimationFrame(() => {
        inputEl.focus()
        inputEl.select()
      })
    }
  }, [focus, loading])

  return (
    <Input
      autoComplete="off"
      type="tel"
      placeholder=""
      aria-label={`${index === 0 ? 'Please enter verification code. ' : ''}Character ${index + 1}`}
      ref={input}
      size="lg"
      disabled={isDisabled || loading}
      value={value && masked ? '●' : value}
      fullWidthContainer={false}
      className={cn(
        className,
        loading && '!border-transparent !bg-transparent !ring-0',
      )}
      containerClassName={cn('h-12 max-w-28 flex-1', loading && 'animate-pulse')}
      {...rest}
    />
  )
}

export interface OtpInputHandle {
  focusInput: (index: number) => void
}

const OtpInput = forwardRef<OtpInputHandle, OTPInput>((props, ref) => {
  const {
    length = 6,
    onChange = () => {},
    masked = true,
    isDisabled = false,
    loading = false,
    enableClearOnComplete = true,
    hasError: externalHasError = false,
    errorMessage: externalErrorMessage,
    title,
    fnGetCode,
    timer: externalTimer = 60,
    smsTexts = {
      resend: 'Отправить код повторно',
      sms: 'Отправить СМС через',
    },
  } = props
  const dataCy = props['data-cy']
  const dataTestId = props['data-testid']

  const [activeInput, setActiveInput] = useState(0)
  const [valueOtp, setValueOtp] = useState<string[]>(
    Array.from({ length }, () => ''),
  )
  const [timer, setTimer] = useState(fnGetCode ? externalTimer : 0)
  const [isTimerActive, setIsTimerActive] = useState(!!fnGetCode)
  const [internalHasError, setInternalHasError] = useState(externalHasError)
  const [internalErrorMessage, setInternalErrorMessage] =
    useState(externalErrorMessage)

  // Focus on input by index
  const focusInput = (input: number) => {
    const activeInput = Math.max(Math.min(length - 1, input), 0)
    setActiveInput(activeInput)
  }

  useImperativeHandle(ref, () => {
    return {
      focusInput,
    }
  })

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1)
      }, 1000)
    } else if (timer === 0) {
      setIsTimerActive(false)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [timer, isTimerActive])

  useEffect(() => {
    setInternalHasError(externalHasError)
    setInternalErrorMessage(externalErrorMessage)
  }, [externalHasError, externalErrorMessage])

  const handleResendCode = () => {
    if (fnGetCode && !isTimerActive) {
      fnGetCode()
      setTimer(externalTimer)
      setIsTimerActive(true)
    }
  }

  // Helper to return OTP from input
  const handleOtpChange = (otp: string[]) => {
    // Очищаем ошибку при любом изменении
    if (internalHasError) {
      setInternalHasError(false)
      setInternalErrorMessage('')
    }

    setValueOtp(otp)
    const otpValue = otp.join('')
    onChange(otpValue)

    // Проверяем, заполнены ли все поля
    if (otpValue.length === length) {
      props.onComplete?.(otpValue)
      if (enableClearOnComplete) {
        setValueOtp(Array.from({ length }, () => ''))
        setActiveInput(0)
      }
    }
  }

  const isInputValueValid = (value: string) => {
    const isTypeValid = !Number.isNaN(Number.parseInt(value, 10))
    return isTypeValid && value.trim().length === 1
  }

  // Focus on next input
  const focusNextInput = () => {
    focusInput(activeInput + 1)
  }

  // Focus on previous input
  const focusPrevInput = () => {
    focusInput(activeInput - 1)
  }

  // Change OTP value at focused input
  const changeCodeAtFocus = (value: string) => {
    const newOtp = [...valueOtp]
    newOtp[activeInput] = value[0] || ''
    handleOtpChange(newOtp)
  }

  // Handle pasted OTP
  const handleOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (isDisabled || loading) {
      return
    }

    let nextActiveInput = activeInput

    // Get pastedData in an array of max size (num of inputs - current position)
    const pastedData = e.clipboardData
      .getData('text/plain')
      .slice(0, length - activeInput)
      .split('')

    // Paste data from focused input onwards
    const newOtp = [...valueOtp]
    for (let pos = 0; pos < length; ++pos) {
      if (pos >= activeInput && pastedData.length > 0) {
        newOtp[pos] = pastedData.shift() as string
        nextActiveInput++
      }
    }

    setActiveInput(nextActiveInput)
    focusInput(nextActiveInput)
    handleOtpChange(newOtp)
  }

  const handleOnChange =
    (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (loading) {
        return
      }

      const { value } = e.target

      // Fix Fill value
      if (idx === 0 && value.length === length) {
        handleOtpChange(value.split(''))
        return
      }

      if (isInputValueValid(value)) {
        changeCodeAtFocus(value)
      }
    }

  // Handle cases of backspace, delete, left arrow, right arrow, space
  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (loading) {
      return
    }

    if (e.keyCode === BACKSPACE || e.key === 'Backspace') {
      e.preventDefault()
      changeCodeAtFocus('')
      focusPrevInput()
    } else if (e.keyCode === DELETE || e.key === 'Delete') {
      e.preventDefault()
      changeCodeAtFocus('')
    } else if (e.keyCode === LEFT_ARROW || e.key === 'ArrowLeft') {
      e.preventDefault()
      focusPrevInput()
    } else if (e.keyCode === RIGHT_ARROW || e.key === 'ArrowRight') {
      e.preventDefault()
      focusNextInput()
    } else if (
      e.keyCode === SPACEBAR ||
      e.key === ' ' ||
      e.key === 'Spacebar' ||
      e.key === 'Space'
    ) {
      e.preventDefault()
    }
  }

  // The content may not have changed, but some input took place hence change the focus
  const handleOnInput = (e: AndroidInputEvent) => {
    if (loading) {
      return
    }

    if (isInputValueValid(e.currentTarget.value)) {
      focusNextInput()
      return
    }
    // This is a workaround for dealing with keyCode "229 Unidentified" on Android.

    if (masked) {
      const { nativeEvent } = e

      if (
        nativeEvent.data === null &&
        nativeEvent.inputType === 'deleteContentBackward'
      ) {
        e.preventDefault()
        changeCodeAtFocus('')
        focusPrevInput()
      }
    }
  }

  const handleOnFocus =
    (i: number) => (e: React.FocusEvent<HTMLInputElement>) => {
      if (loading) {
        return
      }
      setActiveInput(i)
      e.target.select()
    }

  const onBlur = () => {
    if (loading) {
      return
    }
    setActiveInput(-1)
  }

  return (
    <div className="flex min-w-[303px] flex-col gap-2 md:min-w-[352px]">
      {title && (
        <Typography variant="h5" weight="medium">
          {title}
        </Typography>
      )}
      <div className="flex w-full gap-2">
        {Array.from({ length }).map((_, i) => (
          <SingleOtpInputComponent
            key={i}
            index={i}
            masked={masked}
            loading={loading}
            focus={activeInput === i}
            value={valueOtp[i]}
            onChange={handleOnChange(i)}
            onKeyDown={handleOnKeyDown}
            onInput={handleOnInput}
            onPaste={handleOnPaste}
            onFocus={handleOnFocus(i)}
            onBlur={onBlur}
            isDisabled={isDisabled}
            className={cn(
              'flex flex-1 [appearance:textfield] items-center justify-center text-center text-lg [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
              internalHasError && 'border-destructive focus:border-destructive',
            )}
            data-cy={dataCy && `${dataCy}-${i}`}
            data-testid={dataTestId && `${dataTestId}-${i}`}
          />
        ))}
      </div>
      {internalHasError && internalErrorMessage && (
        <Typography variant="p2" textColor="destructive" className="font-cofo">
          {internalErrorMessage}
        </Typography>
      )}
      {fnGetCode && (
        <div>
          {isTimerActive ?
              (
                <Typography variant="p2" textColor="muted" className="font-cofo">
                  {smsTexts.sms}
                  {' '}
                  0:
                  {timer < 10 ? `0${timer}` : timer}
                </Typography>
              ) :
              (
                <Link onClick={handleResendCode}>{smsTexts.resend}</Link>
              )}
        </div>
      )}
    </div>
  )
})

export { OtpInput }
