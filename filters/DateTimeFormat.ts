import moment from 'moment'

import { DATE_TIME_FORMAT } from '@/constants/Time'
import Vue from 'vue'

const dateTimeFormat = Vue.filter('dateTimeFormat', (date: string) => {
  return moment(date).format(DATE_TIME_FORMAT)
})

export default dateTimeFormat
