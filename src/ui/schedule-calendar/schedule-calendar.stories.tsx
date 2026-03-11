import React from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import type { CalendarStripProps } from './schedule-calendar-strip'

import { CalendarStrip } from './schedule-calendar-strip'

const meta: Meta<CalendarStripProps> = {
  title: 'UI/Schedule/CalendarStrip',
  component: CalendarStrip,
}
export default meta

type Story = StoryObj<CalendarStripProps>

export const Default: Story = {
  render: args => (
    <div style={{ width: 1100 }}>
      <CalendarStrip {...args} />
    </div>
  ),
}
