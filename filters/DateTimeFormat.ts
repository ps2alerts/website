import Vue from 'vue'
import { DATE_TIME_FORMAT, TIME_FORMAT } from '@/constants/Time'
import { formatDateTime, utcDate } from '~/utilities/TimeHelper'

export const dateTimeFormat = Vue.filter('dateTimeFormat', (date: string) => {
  return formatDateTime(utcDate(new Date(date)), DATE_TIME_FORMAT)
})

export const dateTimeFormatShort = Vue.filter(
  'dateTimeFormatShort',
  (date: string) => {
    return formatDateTime(utcDate(new Date(date)), TIME_FORMAT)
  }
)

export default { dateTimeFormat, dateTimeFormatShort }
