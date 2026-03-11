import React from 'react'

import type { ToasterProps, ToastT } from 'sonner'

import { Toaster as Sonner, toast as sonnerToast } from 'sonner'

import { Icon } from '../Icon'
import { Spinner } from '../Spinner'

interface ToastOptions {
  id?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  cancel?: {
    label: string
    onClick: () => void
  }
  onDismiss?: (toast: ToastT) => void
  onAutoClose?: (toast: ToastT) => void
  className?: string
  description?: string
  important?: boolean
  unstyled?: boolean
  onExtractError?: (error: unknown) => void
  defaultMessage?: string
}

function extractAllErrorMessages(error: unknown, seen = new Set()): string[] {
  const messages: string[] = []

  if (typeof error === 'string') {
    if (error.trim() !== '') {
      messages.push(error)
    }
    return messages
  }

  if (error instanceof Error) {
    const message = error.message || error.name
    if (message && message.trim() !== '') {
      messages.push(message)
    }
    return messages
  }

  if (Array.isArray(error)) {
    for (const item of error) {
      messages.push(...extractAllErrorMessages(item, seen))
    }
    return messages
  }

  if (error && typeof error === 'object' && !seen.has(error)) {
    seen.add(error)
    const possibleMessageFields = [
      'message',
      'error',
      'msg',
      'text',
      'description',
      'detail',
      'errors',
    ]
    for (const field of possibleMessageFields) {
      const errorObj = error as Record<string, unknown>
      if (field in errorObj) {
        messages.push(...extractAllErrorMessages(errorObj[field], seen))
      }
    }
  }

  if (typeof error !== 'object' && error !== null && error !== undefined) {
    const stringValue = String(error)
    if (stringValue.trim() !== '') {
      messages.push(stringValue)
    }
  }

  return Array.from(new Set(messages)).filter(
    msg => msg !== '[object Object]',
  )
}

function extractErrorMessage(
  error: unknown,
  onExtractError?: (error: unknown) => void,
  defaultMessage?: string,
): string[] {
  const messages = extractAllErrorMessages(error)

  if (messages.length === 0) {
    if (onExtractError) {
      onExtractError(error)
    }
    return [defaultMessage || 'Произошла ошибка']
  }

  return messages
}

function createToastFunction(message: string | React.ReactNode, options?: ToastOptions): string | number {
  return sonnerToast(message, options)
}

const toast = Object.assign(createToastFunction, {
  success: (message: unknown, options?: ToastOptions): string | number | (string | number)[] => {
    const messages =
      typeof message === 'string' ?
          [options?.defaultMessage || message] :
          extractErrorMessage(
            message,
            options?.onExtractError,
            options?.defaultMessage,
          )

    if (messages.length > 1) {
      return messages.map((msg) => {
        const createToast = (): string | number => {
          const id = sonnerToast.success(
            <div
              onClick={() => sonnerToast.dismiss(id)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  sonnerToast.dismiss(id)
                }
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer', width: '100%' }}
            >
              {msg}
            </div>,
            {
              ...options,
              duration: Infinity,
              unstyled: false,
            },
          )
          return id
        }
        return createToast()
      })
    }

    return sonnerToast.success(messages[0], options)
  },
  error: (message: unknown, options?: ToastOptions): string | number | (string | number)[] => {
    const messages =
      typeof message === 'string' ?
          [options?.defaultMessage || message] :
          extractErrorMessage(
            message,
            options?.onExtractError,
            options?.defaultMessage,
          )

    if (messages.length > 1) {
      return messages.map((msg) => {
        const createToast = (): string | number => {
          const id = sonnerToast.error(
            <div
              onClick={() => sonnerToast.dismiss(id)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  sonnerToast.dismiss(id)
                }
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer', width: '100%' }}
            >
              {msg}
            </div>,
            {
              ...options,
              duration: Infinity,
              unstyled: false,
            },
          )
          return id
        }
        return createToast()
      })
    }

    return sonnerToast.error(messages[0], options)
  },
  info: (message: unknown, options?: ToastOptions): string | number | (string | number)[] => {
    const messages =
      typeof message === 'string' ?
          [options?.defaultMessage || message] :
          extractErrorMessage(
            message,
            options?.onExtractError,
            options?.defaultMessage,
          )

    // Если сообщений больше 1, создаем несколько тостов с бесконечной duration
    if (messages.length > 1) {
      return messages.map((msg) => {
        // Создаем замыкание для toastId
        const createToast = (): string | number => {
          const id = sonnerToast.info(
            // Обертка с обработчиком клика для закрытия
            <div
              onClick={() => sonnerToast.dismiss(id)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  sonnerToast.dismiss(id)
                }
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer', width: '100%' }}
            >
              {msg}
            </div>,
            {
              ...options,
              duration: Infinity, // Не скрываем автоматически
              unstyled: false,
            },
          )
          return id
        }
        return createToast()
      })
    }

    return sonnerToast.info(messages[0], options)
  },
  warning: (message: unknown, options?: ToastOptions): string | number | (string | number)[] => {
    const messages =
      typeof message === 'string' ?
          [options?.defaultMessage || message] :
          extractErrorMessage(
            message,
            options?.onExtractError,
            options?.defaultMessage,
          )

    // Если сообщений больше 1, создаем несколько тостов с бесконечной duration
    if (messages.length > 1) {
      return messages.map((msg) => {
        // Создаем замыкание для toastId
        const createToast = (): string | number => {
          const id = sonnerToast.warning(
            // Обертка с обработчиком клика для закрытия
            <div
              onClick={() => sonnerToast.dismiss(id)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  sonnerToast.dismiss(id)
                }
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer', width: '100%' }}
            >
              {msg}
            </div>,
            {
              ...options,
              duration: Infinity,
              unstyled: false,
            },
          )
          return id
        }
        return createToast()
      })
    }

    return sonnerToast.warning(messages[0], options)
  },
  loading: (message: unknown, options?: ToastOptions): string | number | (string | number)[] => {
    const messages =
      typeof message === 'string' ?
          [options?.defaultMessage || message] :
          extractErrorMessage(
            message,
            options?.onExtractError,
            options?.defaultMessage,
          )

    if (messages.length > 1) {
      return messages.map((msg) => {
        const createToast = (): string | number => {
          const id = sonnerToast.loading(
            <div
              onClick={() => sonnerToast.dismiss(id)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  sonnerToast.dismiss(id)
                }
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer', width: '100%' }}
            >
              {msg}
            </div>,
            {
              ...options,
              unstyled: false,
            },
          )
          return id
        }
        return createToast()
      })
    }

    return sonnerToast.loading(messages[0], options)
  },
  dismiss: (toastId?: string | number): void => {
    sonnerToast.dismiss(toastId)
  },
  promise<T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
      ...options
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    } & ToastOptions,
  ) {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
      ...options,
    })
  },
})

function Toaster({ ...props }: ToasterProps): JSX.Element {
  return (
    <Sonner
      visibleToasts={Infinity}
      gap={4}
      style={{
        zIndex: 1020,
      }}
      className="toaster group left-[0]! mx-auto! flex! w-auto! max-w-[100%]! flex-col! items-center! justify-center! max-sm:right-0! max-sm:w-full! md:left-[50%]! md:w-auto! md:max-w-[356px]! [&_[data-content]]:w-max [&_[data-sonner-toast]]:max-sm:right-auto! [&_[data-sonner-toast]]:max-sm:left-auto! [&_[data-title]]:line-clamp-2 [&_[data-title]]:font-normal!"
      toastOptions={{
        className:
          'text-white! font-graphik font-normal! bg-spotlight-background! border-spotlight-background! rounded-[1000px]! w-fit! md:w-auto! max-w-[92%]! md:max-w-[500px]! py-2.5! px-4! m-0! min-h-10 gap-2! text-center! align-center! cursor-pointer!',
        style: {
          // @ts-expect-error CSS custom properties are not typed in React's style object
          '--z-index': 1020,
          'z-index': 'calc(var(--z-index) - var(--index))',
          '--toast-icon-margin-start': '0px',
          '--toast-icon-margin-end': '0px',
        },
        dismissible: true,
      }}
      position="top-center"
      icons={{
        success: <Icon icon="CheckCircleFillIcon" className="text-positive" />,
        info: <Icon icon="InfoFillIcon" />,
        error: <Icon icon="CancelFillIcon" className="text-destructive" />,
        loading: <Spinner className="text-white" />,
        warning: <Icon icon="InfoFillIcon" className="text-warning" />,
      }}
      {...props}
    />
  )
}

export { toast, Toaster }
export type { ToastOptions }
