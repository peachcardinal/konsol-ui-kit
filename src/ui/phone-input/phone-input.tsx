import * as React from 'react'
import { memo } from 'react'
import * as RPNInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import en from 'react-phone-number-input/locale/en.json'

import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils'
import { useDeviceDetector } from '@/utils/use-device-detector'

import { Icon } from '../Icon'
import { Button } from '../button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '../Command'
import * as RadixDialog from '@radix-ui/react-dialog'
import { InputSearch } from '../Input'
import { MaskedInput } from '../MaskedInput'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover'
import { ScrollArea } from '../ScrollArea'
import { Typography } from '../Typography'

type InputProps = ComponentPropsWithoutRef<typeof InputSearch>
import { translations } from './constants'
import ru from './locales/ru.json'
import tg from './locales/tg.json'
import uz from './locales/uz.json'
import { getCountryMasks } from './phone-input-utils'

type PhoneInputProps = Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'value' | 'ref' | 'size'
> &
Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange' | 'size'> & {
  onChange?: (value: RPNInput.Value | string) => void
  onValidationChange?: (isValid: boolean) => void
  disabled?: boolean
  disabledCountry?: boolean
  autoFocus?: boolean
  value?: RPNInput.Value | string
  label?: string
  error?: string
  size?: 'md' | 'lg'
  caption?: string
  'data-testid'?: string
  initialCountry?: RPNInput.Country
  locale?: 'ru' | 'en' | 'uz' | 'tg'
}

type ExtendedInputProps = InputProps & {
  masks?: string[]
  mask: string
  onMaskChange: (mask: string) => void
  size?: 'md' | 'lg'
}

const InputComponent = React.forwardRef<HTMLInputElement, ExtendedInputProps>(
  (
    { className, masks, mask, onChange, onMaskChange, size = 'lg', ...props },
    ref,
  ) => {
    const device = useDeviceDetector()
    const MaskSelector = () => (
      <Command>
        <CommandList>
          <CommandGroup>
            {masks?.map((m, i) => (
              <CommandItem
                key={i}
                onSelect={() => onMaskChange(m)}
                className="gap-2 hover:bg-muted transition-colors"
              >
                <span className="text-[14px]">{m}</span>
                {m === mask && <Icon icon="DoneIcon" className="ml-2 size-4" />}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    )

    return (
      <div className="relative flex-1">
        <MaskedInput
          mask={mask}
          alwaysShowMask
          className={className}
          containerClassName="rounded-none border-0 border-none text-[16px] hover:border-0 focus:border-0 enabled:hover:border-0 focus-within:shadow-none"
          error={undefined}
          caption={undefined}
          maskChar={null}
          onPaste={(e) => {
            e.preventDefault()
            const text = e.clipboardData.getData('text/plain')
            const target = e.target as HTMLInputElement
            const parsePhone = RPNInput.parsePhoneNumber(text)
            let copyPhone = ''
            if (
              !parsePhone?.country &&
              (text.startsWith('+8') || text.startsWith('8'))
            ) {
              copyPhone = `+${text.replace(/\D/g, '').replace('8', '7')}`
            } else if (!parsePhone?.country && text.startsWith('7')) {
              copyPhone = `+${text}`
            } else {
              copyPhone = text
            }
            target.value = copyPhone

            const event = {
              ...e,
              target,
            } as React.ChangeEvent<HTMLInputElement>
            onChange?.(event)
          }}
          onChange={onChange}
          size={size}
          {...props}
          ref={ref}
        />
        {masks && masks.length > 1 && (
          <>
            {device === 'mobile' && (
              <RadixDialog.Root>
                <RadixDialog.Trigger asChild>
                  <Button
                    type="button"
                    variant="text"
                    size="sm"
                    className="absolute top-1/2 right-2 -translate-y-1/2 px-2"
                  >
                    <Icon icon="UnfoldIcon" className="size-4" />
                  </Button>
                </RadixDialog.Trigger>
                <RadixDialog.Portal>
                  <RadixDialog.Overlay />
                  <RadixDialog.Content
                    className={cn(
                      'fixed left-1/2 top-1/2 z-[52] w-full max-w-[425px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-4 shadow-lg',
                    )}
                  >
                    <MaskSelector />
                  </RadixDialog.Content>
                </RadixDialog.Portal>
              </RadixDialog.Root>
            )}
            {device !== 'mobile' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="text"
                    size="sm"
                    className="absolute top-1/2 right-2 -translate-y-1/2 px-2"
                  >
                    <Icon icon="UnfoldIcon" className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-fit p-0">
                  <MaskSelector />
                </PopoverContent>
              </Popover>
            )}
          </>
        )}
      </div>
    )
  },
)
InputComponent.displayName = 'InputComponent'

export function normalizePhoneInput(
  value: RPNInput.Value | string,
): RPNInput.Value | string {
  if (!value) {
    return ''
  }

  // Убираем все нецифровые символы для проверки
  // const digitsOnly = value.replace(/\D/g, '')

  // // Проверяем, начинается ли номер с 8 и является ли страна RU или KZ
  // if (digitsOnly.startsWith('8') && (country === 'RU' || country === 'KZ')) {
  //   // Преобразуем 8 в 7, сохраняя остальную часть номера
  //   return `7${digitsOnly.substring(1)}` as unknown as RPNInput.Value
  // }

  return value
}

interface CountryEntry {
  label: string
  value: RPNInput.Country | undefined
}

interface CountrySelectProps {
  disabled?: boolean
  value: RPNInput.Country
  options: CountryEntry[]
  onChange: (country: RPNInput.Country) => void
  defaultCountry: RPNInput.Country
  inputSize?: 'md' | 'lg'
  locale: typeof en | typeof ru | typeof uz | typeof tg
  translations:
    | (typeof translations)['ru']
    | (typeof translations)['en']
    | (typeof translations)['uz']
    | (typeof translations)['tg']
}

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  onChange: (country: RPNInput.Country) => void
}

export function FlagComponent({ country, countryName }: RPNInput.FlagProps) {
  const Flag = flags[country]
  return (
    <span
      className={cn(
        'flex h-4 w-4 items-center justify-center',
        'overflow-hidden rounded-full',
        '[&_svg]:h-full [&_svg]:w-full',
        '[&_svg]:origin-center [&_svg]:scale-150',
      )}
    >
      {Flag && <Flag title={countryName} />}
    </span>
  )
}

export const CountrySelectOption = memo(
  ({ country, countryName, onChange }: CountrySelectOptionProps) => {
    return (
      <CommandItem className="w-auto gap-2 hover:bg-muted transition-colors" onSelect={() => onChange(country)}>
        <FlagComponent country={country} countryName={countryName} />
        <span className="flex-1 text-[14px]">{countryName}</span>
        <span className="text-foreground/50">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
      </CommandItem>
    )
  },
)

const CountrySelect = memo(
  ({
    disabled,
    value: selectedCountry,
    defaultCountry,
    options: countryList,
    onChange,
    locale,
    translations: t,
    inputSize = 'lg',
  }: CountrySelectProps) => {
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState('')
    const device = useDeviceDetector()

    const handleCountryChange = (country: RPNInput.Country) => {
      onChange(country)
      setOpen(false)
    }

    const filteredCountries = React.useMemo(() => {
      if (!searchQuery) {
        return countryList
      }

      const query = searchQuery.toLowerCase()
      return countryList.filter(({ value, label }) => {
        if (!value) {
          return false
        }
        const countryName = locale[value]?.toLowerCase() || label.toLowerCase()
        const countryCode = RPNInput.getCountryCallingCode(value)
        return (
          countryName.includes(query) ||
          value.toLowerCase().includes(query) ||
          `+${countryCode}`.includes(query)
        )
      })
    }, [countryList, searchQuery])

    return (
      <>
        {device === 'mobile' && (
          <RadixDialog.Root open={open} onOpenChange={setOpen}>
            <RadixDialog.Trigger
              asChild
              disabled={disabled}
              className={cn('border-none bg-white pr-0.5 pl-1', {
                'bg-muted': disabled,
              })}
            >
              <Button
                type="button"
                variant="default"
                size="custom"
                className={cn('flex w-11 rounded-xl p-0 px-2', {
                  'bg-border': disabled,
                  'h-6': inputSize === 'md',
                  'h-8': inputSize === 'lg',
                })}
                disabled={disabled}
              >
                <FlagComponent
                  country={selectedCountry}
                  countryName={locale[selectedCountry]}
                />
                <Icon
                  icon="UnfoldIcon"
                  className={cn(
                    '-mr-2 ml-0.5 size-3 opacity-50',
                    disabled ? 'hidden' : 'opacity-100',
                  )}
                />
              </Button>
            </RadixDialog.Trigger>
            <RadixDialog.Portal>
              <RadixDialog.Overlay />
              <RadixDialog.Content
                className={cn('fixed left-1/2 top-1/2 z-[52] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-0 shadow-lg')}
              >
                  <Command shouldFilter className="rounded-xl">
                    <div>
                      <InputSearch
                        placeholder={t.searchCountry}
                        value={searchQuery}
                        phoneInputSearch
                        tabIndex={-1}
                        className="h-9"
                        type="border"
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <CommandList>
                      <ScrollArea className="h-60">
                        {filteredCountries.length > 0 && (
                          <CommandGroup>
                            {filteredCountries.map(({ value, label }) => {
                              if (!value) {
                                return null
                              }
                              return (
                                <CountrySelectOption
                                  key={value}
                                  country={value}
                                  countryName={locale[value] || label}
                                  onChange={handleCountryChange}
                                />
                              )
                            })}
                          </CommandGroup>
                        )}
                        {filteredCountries.length === 0 && (
                          <CommandEmpty>{t.notFound}</CommandEmpty>
                        )}
                      </ScrollArea>
                    </CommandList>
                  </Command>
              </RadixDialog.Content>
            </RadixDialog.Portal>
          </RadixDialog.Root>
        )}
        {device !== 'mobile' && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              disabled={disabled}
              className={cn('border-none bg-white pr-0.5 pl-1', {
                'bg-muted': disabled,
              })}
            >
              <Button
                type="button"
                variant="default"
                size="custom"
                className={cn('flex w-11 rounded-md p-0 px-2', {
                  'h-6': inputSize === 'md',
                  'h-8': inputSize === 'lg',
                  'bg-border': disabled,
                })}
                disabled={disabled}
              >
                <FlagComponent
                  country={selectedCountry || defaultCountry}
                  countryName={locale[selectedCountry || defaultCountry]}
                />
                <Icon
                  icon="UnfoldIcon"
                  className={cn(
                    '-mr-2 ml-0 size-3 opacity-50',
                    disabled ? 'hidden' : 'opacity-100',
                  )}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="rounded-xl p-0 shadow-[0_2px_10px_rgba(0,0,0,0.1)] md:w-[400px] lg:w-[252px]"
            >
              <Command shouldFilter className="rounded-xl">
                <InputSearch
                  phoneInputSearch
                  placeholder={t.searchCountry}
                  value={searchQuery}
                  type="border"
                  className="h-9"
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <CommandList className="border-border">
                  <ScrollArea
                    className="h-60"
                    onWheel={e => e.stopPropagation()}
                  >
                    {filteredCountries.length > 0 && (
                      <CommandGroup>
                        {filteredCountries.map(({ value, label }) => {
                          if (!value) {
                            return null
                          }
                          return (
                            <CountrySelectOption
                              key={value}
                              country={value}
                              countryName={locale[value] || label}
                              onChange={handleCountryChange}
                            />
                          )
                        })}
                      </CommandGroup>
                    )}
                    {filteredCountries.length === 0 && (
                      <CommandEmpty>{t.notFound}</CommandEmpty>
                    )}
                  </ScrollArea>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </>
    )
  },
)

const PhoneInputInner = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps
>(
  (
    {
      className,
      onChange,
      label,
      error,
      caption,
      value = '',
      'data-testid': dataTestId,
      initialCountry,
      onValidationChange,
      locale = 'ru',
      size = 'lg',
      ...props
    },
    ref,
  ) => {
    const [mask, setMask] = React.useState(() => '')
    const [masks, setMasks] = React.useState<string[]>([])
    const [selectedCountry, setSelectedCountry] = React.useState<
      RPNInput.Country | undefined
    >(initialCountry)

    const currentLocale = (() => {
      switch (locale) {
        case 'en':
          return en
        case 'uz':
          return uz
        case 'tg':
          return tg
        case 'ru':
        default:
          return ru
      }
    })()
    const t = translations[locale]

    React.useEffect(() => {
      if (value && value !== '+7') {
        const parsePhone = RPNInput.parsePhoneNumber(value)
        if (
          !parsePhone?.country &&
          (value.startsWith('+8') || value.startsWith('8'))
        ) {
          onChange?.(`+${value.replace(/\D/g, '').replace('8', '7')}`)
          return
        }
        if (
          parsePhone?.country === 'RU' ||
          parsePhone?.country === 'KZ' ||
          (!parsePhone?.country && value.startsWith('+7'))
        ) {
          const digitsOnly = value.replace(/\D/g, '')
          const firstDigit = digitsOnly[1]

          if (digitsOnly.slice(1, 4) === '000') {
            setSelectedCountry('RU')
            setMask(getCountryMasks('RU')[0])
            setMasks(getCountryMasks('RU'))
            return
          }

          if (firstDigit === '0' || firstDigit === '6' || firstDigit === '7') {
            setSelectedCountry('KZ')
            setMask(getCountryMasks('KZ')[0])
            setMasks(getCountryMasks('KZ'))
            return
          }

          setSelectedCountry('RU')
          setMask(getCountryMasks('RU')[0])
          setMasks(getCountryMasks('RU'))
          return
        }
        if (parsePhone?.country) {
          setSelectedCountry(parsePhone.country)
          setMask(getCountryMasks(parsePhone.country)[0])
          setMasks(getCountryMasks(parsePhone.country) || [])
        }
      } else if (initialCountry) {
        setSelectedCountry(initialCountry)
        setMask(getCountryMasks(initialCountry)[0])
        setMasks(getCountryMasks(initialCountry))
      } else {
        setSelectedCountry('RU')
        setMask(getCountryMasks('RU')[0])
        setMasks(getCountryMasks('RU'))
      }
    }, [])

    const handleChange = (newValue: RPNInput.Value) => {
      // Нормализуем значение при любом изменении, передавая текущую страну

      const normalizedValue = normalizePhoneInput(newValue)
      onChange?.(normalizedValue as RPNInput.Value)
      const isValid = RPNInput.isPossiblePhoneNumber(normalizedValue)
      onValidationChange?.(isValid)
    }

    const handleCountryChange = (country: RPNInput.Country) => {
      setSelectedCountry(country)
      setMask(getCountryMasks(country)[0])
      setMasks(getCountryMasks(country) || [])
      // Сбрасываем номер телефона при смене страны, оставляя только код страны
      if (selectedCountry !== undefined) {
        const countryCode =
          `+${RPNInput.getCountryCallingCode(country)}` as RPNInput.Value
        onChange?.(countryCode)
      } else {
        onChange?.(value)
      }
    }

    const handleMaskChange = (mask: string) => {
      setMask(mask)
    }

    return (
      <>
        {label && (
          <Typography variant={size === 'md' ? 'p2' : 'p3'} weight="medium" className="mb-1.5">
            {label}
          </Typography>
        )}
        <RPNInput.default
          ref={ref}
          data-testid={dataTestId}
          value={value}
          tabIndex={0}
          defaultCountry={selectedCountry}
          className={cn(
            'border-border flex overflow-hidden border transition-colors',
            'hover:border-hover-input-primary focus-within:border-primary focus-within:shadow-focus flex items-center bg-white',
            { 'h-8 rounded-lg': size === 'md' },
            { 'h-10 rounded-xl': size === 'lg' },
            className,
            { 'hover:border-border bg-muted': props.disabled },
          )}
          flagComponent={FlagComponent}
          countryCallingCodeEditable={false}
          countrySelectComponent={CountrySelect}
          countrySelectProps={{
            defaultCountry: selectedCountry,
            locale: currentLocale,
            translations: t,
            inputSize: size,
          }}
          inputComponent={InputComponent}
          labels={currentLocale}
          smartCaret={false}
          onChange={handleChange}
          mask={mask}
          masks={masks}
          onMaskChange={handleMaskChange}
          onCountryChange={handleCountryChange}
          countryOptionsOrder={[
            'RU',
            'BY',
            'KZ',
            'UZ',
            'UA',
            'GE',
            'MD',
            'KG',
            'IL',
            'ES',
          ]}
          {...props}
        />
        {caption && (
          <Typography variant="p1" className="mt-1.5" textColor="secondary">
            {caption}
          </Typography>
        )}
        {error && (
          <Typography variant="p2" className="mt-1.5" textColor="destructive">
            {error}
          </Typography>
        )}
      </>
    )
  },
)

export { PhoneInputInner as PhoneInput }
