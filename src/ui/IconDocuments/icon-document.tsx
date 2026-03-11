import type { PropsWithChildren } from 'react'
import { Suspense, useMemo } from 'react'

import type { IconDocumentsName } from './icons-document.ts'

import { iconsDocuments } from './icons-document.ts'

export interface IconDocumentProps {
  icon: IconDocumentsName
  color?: string | 'currentColor'
  size?: 40 | 80 | number
}

function IconDocument({
  icon,
  color = 'currentColor',
  size = 40,
}: PropsWithChildren<IconDocumentProps>) {
  const SvgIcon = useMemo(() => iconsDocuments[icon], [icon])

  if (!SvgIcon)
    return null
  return (
    <div
      style={{
        fontSize: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
      }}
    >
      <Suspense fallback={null}>
        <SvgIcon />
      </Suspense>
    </div>
  )
}

export { IconDocument }
