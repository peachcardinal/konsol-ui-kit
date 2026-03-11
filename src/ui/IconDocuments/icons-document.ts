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

export const iconsDocuments = {
  Normal: lazy(async () => import('./assets/normal-icon.svg')),
  Failed: lazy(async () => import('./assets/failed-icon.svg')),
  Signed: lazy(async () => import('./assets/signed-icon.svg')),
  Warning: lazy(async () => import('./assets/warning-icon.svg')),
  Waiting: lazy(async () => import('./assets/waiting-icon.svg')),
  Error: lazy(async () => import('./assets/error-icon.svg')),
  Passport: lazy(async () => import('./assets/passport-main.svg')),
  Registration: lazy(async () => import('./assets/passport-registration.svg')),
  Selfie: lazy(async () => import('./assets/passport-selfie.svg')),
  Accept: lazy(async () => import('./assets/accept-icon.svg')),
}

export type IconDocumentsName = keyof typeof iconsDocuments
