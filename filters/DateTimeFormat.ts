import moment from 'moment'

import Vue from 'vue'
import { DATE_TIME_FORMAT, TIME_FORMAT } from '@/constants/Time'

const dateTimeFormat = Vue.filter('dateTimeFormat', (date: string) => {
  return moment(date).format(DATE_TIME_FORMAT)
})

const dateTimeFormatShort = Vue.filter(
  'dateTimeFormatShort',
  (date: string) => {
    return moment(date).format(TIME_FORMAT)
  }
)

export default { dateTimeFormat, dateTimeFormatShort }
