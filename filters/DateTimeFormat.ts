import moment from 'moment'

import { DATE_TIME_FORMAT } from '@/constants/Time'
import Vue from 'vue'

const dateTimeFormat = Vue.filter(
  'dateTimeFormat',
  (isoDate: string, format?: string) => {
    const dateObj = moment(isoDate)
    return dateObj.format(format ?? DATE_TIME_FORMAT)
  }
)

export default dateTimeFormat
