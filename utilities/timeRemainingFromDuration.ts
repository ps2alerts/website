import moment from 'moment-timezone'

const timeRemainingFromDuration = (
  startSeconds: number,
  durationSeconds: number
): number => {
  const now = parseInt(moment().tz('UTC').format('X'), 10)
  const end = parseInt(
    moment(startSeconds * 1000)
      .add(durationSeconds, 'second')
      .format('X'),
    10
  )

  return end - now
}

export default timeRemainingFromDuration
