import moment, { Moment } from 'moment-timezone'

const AlertRemainingTimeText = (remainingTime: number): string => {
  const now: Moment = moment().tz('UTC')
  const end = moment().tz('UTC').add(remainingTime, 's')
  const duration = moment.duration(end.diff(now))
  const finalRender = moment()
    .tz('UTC')
    .set('second', duration.seconds())
    .set('minute', duration.minutes())
    .set('hour', duration.hours())
  return finalRender.format('HH:mm:ss')
}

export default AlertRemainingTimeText
