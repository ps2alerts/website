import moment, { Moment, unitOfTime } from 'moment-timezone'

const AlertRemainingTime = (
  start: string,
  duration: number,
  format: unitOfTime.Base = 'seconds'
) => {
  const now: Moment = moment().tz('UTC')
  const end = moment(start).tz('UTC').add(duration, 'ms')
  return end.diff(now, format)
}

export default AlertRemainingTime
