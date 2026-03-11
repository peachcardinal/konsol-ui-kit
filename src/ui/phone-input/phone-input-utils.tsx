import { PHONE_MASKS } from './phone-mask'

// Fallback mask для стран, которых нет в списке
const DEFAULT_MASK = '+999999999999999'

export function formatMask(mask: string): string {
  return mask
    .replace(/\+/g, '+')
    .replace(/\(/g, '(')
    .replace(/\)/g, ')')
    .replace(/#/g, '9')
    .replace(/-/g, '-')
}

export function getCountryMasks(country: string | null): string[] {
  if (!country) {
    return [DEFAULT_MASK]
  }
  const countryKey = country as keyof typeof PHONE_MASKS
  const masks = PHONE_MASKS[countryKey]
  console.log('masks', masks, Array.from(masks).map(formatMask))
  if (!masks)
    return [DEFAULT_MASK]

  return Array.from(masks).map(formatMask)
}
