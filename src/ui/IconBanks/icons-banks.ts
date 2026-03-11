import { lazy as _lazy } from 'react'

interface SvgComponent {
  ReactComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

function lazy(importFn: () => Promise<SvgComponent>) {
  return _lazy(async () => {
    const m = await importFn()
    return { default: m.ReactComponent }
  })
}

export const iconsBanks = {
  AlfaIcon: lazy(async () => import('./assets/alfa-icon.svg')),
  BaltiyskiyIcon: lazy(async () => import('./assets/baltiyskiy-icon.svg')),
  EuropaIcon: lazy(async () => import('./assets/europa-icon.svg')),
  GazpromIcon: lazy(async () => import('./assets/gazprom-icon.svg')),
  HomeIcon: lazy(async () => import('./assets/home-icon.svg')),
  MkbIcon: lazy(async () => import('./assets/mkb-icon.svg')),
  MtsIcon: lazy(async () => import('./assets/mts-icon.svg')),
  OtkritieIcon: lazy(async () => import('./assets/otkritie-icon.svg')),
  OtpIcon: lazy(async () => import('./assets/otp-icon.svg')),
  PsbIcon: lazy(async () => import('./assets/psb-icon.svg')),
  QiwiIcon: lazy(async () => import('./assets/qiwi-icon.svg')),
  RaiffeisenIcon: lazy(async () => import('./assets/raiffeisen-icon.svg')),
  RussianStandartIcon: lazy(
    async () => import('./assets/russian-standart-icon.svg'),
  ),
  SaintPetersburgIcon: lazy(
    async () => import('./assets/saint-petersburg-icon.svg'),
  ),
  SberIcon: lazy(async () => import('./assets/sber-icon.svg')),
  SkbIcon: lazy(async () => import('./assets/skb-icon.svg')),
  TbankIcon: lazy(async () => import('./assets/tbank-icon.svg')),
  TochkaIcon: lazy(async () => import('./assets/tochka-icon.svg')),
  TrustIcon: lazy(async () => import('./assets/trust-icon.svg')),
  UniIcon: lazy(async () => import('./assets/uni-icon.svg')),
  UralsibIcon: lazy(async () => import('./assets/uralsib-icon.svg')),
  UralskiyIcon: lazy(async () => import('./assets/uralskiy-icon.svg')),
  VozrozhdenieIcon: lazy(async () => import('./assets/vozrozhdenie-icon.svg')),
  VtbIcon: lazy(async () => import('./assets/vtb-icon.svg')),
  YandexIcon: lazy(async () => import('./assets/yandex-icon.svg')),
}

export type IconBanksName = keyof typeof iconsBanks
