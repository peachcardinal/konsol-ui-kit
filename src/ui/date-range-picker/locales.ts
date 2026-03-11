import type { Locale, LocaleWidth } from 'date-fns'

import { ru } from 'date-fns/locale'

const uzMonthsLong = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr',
]

const uzMonthsShort = [
  'Yan',
  'Fev',
  'Mar',
  'Apr',
  'May',
  'Iyn',
  'Iyl',
  'Avg',
  'Sen',
  'Okt',
  'Noy',
  'Dek',
]

const uzWeekdaysLong = [
  'Yakshanba',
  'Dushanba',
  'Seshanba',
  'Chorshanba',
  'Payshanba',
  'Juma',
  'Shanba',
]

const uzWeekdaysShort = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan']

const tgMonthsLong = [
  'Январ',
  'Феврал',
  'Март',
  'Апрел',
  'Май',
  'Июн',
  'Июл',
  'Август',
  'Сентябр',
  'Октябр',
  'Ноябр',
  'Декабр',
]

const tgMonthsShort = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
]

const tgWeekdaysLong = [
  'Якшанбе',
  'Душанбе',
  'Сешанбе',
  'Чоршанбе',
  'Панҷшанбе',
  'Ҷумъа',
  'Шанбе',
]

const tgWeekdaysShort = ['Якш', 'Душ', 'Сеш', 'Чор', 'Пан', 'Ҷум', 'Шан']

export const uz: Locale = {
  ...ru,
  code: 'uz',
  localize: {
    ...ru.localize,
    month: (month: number, options?: { width?: LocaleWidth }) => {
      const width = options?.width || 'wide'
      if (width === 'abbreviated') {
        return uzMonthsShort[month]
      }
      return uzMonthsLong[month]
    },
    day: (day: number, options?: { width?: LocaleWidth }) => {
      const width = options?.width || 'wide'
      if (width === 'short' || width === 'abbreviated' || width === 'narrow') {
        return uzWeekdaysShort[day]
      }
      return uzWeekdaysLong[day]
    },
    ordinalNumber: (num: number) => String(num),
  },
  formatLong: {
    ...ru.formatLong,
    date: () => 'dd.MM.yyyy',
    time: () => 'HH:mm',
    dateTime: () => 'dd.MM.yyyy HH:mm',
  },
}

export const tg: Locale = {
  ...ru,
  code: 'tg',
  localize: {
    ...ru.localize,
    month: (month: number, options?: { width?: LocaleWidth }) => {
      const width = options?.width || 'wide'
      if (width === 'abbreviated') {
        return tgMonthsShort[month]
      }
      return tgMonthsLong[month]
    },
    day: (day: number, options?: { width?: LocaleWidth }) => {
      const width = options?.width || 'wide'
      if (width === 'short' || width === 'abbreviated' || width === 'narrow') {
        return tgWeekdaysShort[day]
      }
      return tgWeekdaysLong[day]
    },
    ordinalNumber: (num: number) => String(num),
  },
  formatLong: {
    ...ru.formatLong,
    date: () => 'dd.MM.yyyy',
    time: () => 'HH:mm',
    dateTime: () => 'dd.MM.yyyy HH:mm',
  },
}
