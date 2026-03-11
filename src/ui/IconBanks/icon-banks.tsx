import type { PropsWithChildren } from 'react'
import { Suspense, useMemo } from 'react'

import type { IconBanksName } from './icons-banks.ts'

import { iconsBanks } from './icons-banks.ts'

export interface IconBanksProps {
  icon: IconBanksName
}

function IconBanks({ icon }: PropsWithChildren<IconBanksProps>) {
  const SvgIcon = useMemo(() => iconsBanks[icon], [icon])

  if (!SvgIcon)
    return null
  return (
    <div
      style={{
        fontSize: '40px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Suspense fallback={null}>
        <SvgIcon />
      </Suspense>
    </div>
  )
}

export { IconBanks }
