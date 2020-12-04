import moment from 'moment'
import Vue from 'vue'

const alertEndTime = Vue.filter(
  'alertEndTime',
  (start: string, duration: number, format: string) => {
    return moment(start).add(duration, 'ms').format(format)
  }
)

export default alertEndTime
