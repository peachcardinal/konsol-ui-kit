import React from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import type { IconBanksName } from './icons-banks'

import { IconBanks } from './icon-banks'
import { iconsBanks } from './icons-banks'

const meta = {
  title: 'Иконки/IconBanks',
  component: IconBanks,
  parameters: {
    layout: 'padded',
    docs: {
      story: {
        inline: false,
        iframeHeight: 600,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof IconBanks>

export default meta
type Story = StoryObj<typeof IconBanks>

function IconGallery() {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      padding: '20px',
      background: '#f5f5f5',
    }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '16px',
        width: '100%',
        margin: '0 auto',
      }}
      >
        {(Object.keys(iconsBanks) as IconBanksName[]).map(iconName => (
          <div
            key={iconName}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 8px',
              background: 'white',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minHeight: '90px',
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget
              target.style.transform = 'translateY(-2px)'
              target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget
              target.style.transform = 'none'
              target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              background: '#f8f8f8',
              borderRadius: '6px',
              padding: '8px',
            }}
            >
              <IconBanks icon={iconName} />
            </div>
            <div style={{
              fontSize: '12px',
              textAlign: 'center',
              color: '#444',
              lineHeight: '1.3',
              wordBreak: 'break-word',
              width: '100%',
              padding: '0 4px',
            }}
            >
              {iconName.replace('Icon', '')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const Gallery: Story = {
  render: () => <IconGallery />,
}
