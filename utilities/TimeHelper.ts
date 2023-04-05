import { formatInTimeZone } from 'date-fns-tz'
import {
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns'
import { DATETIME_FORMATS } from '~/constants/Time'

export const utcDate = (date: Date): Date => {
  return new Date(
    formatInTimeZone(new Date(date), 'UTC', 'yyyy-MM-dd HH:mm:ssXX')
  )
}

export const formatDateTime = (
  date: Date,
  formatTo: DATETIME_FORMATS
): string => {
  return format(date, formatTo)
}

export const getStartOfDay = (date: Date): Date => {
  return startOfDay(date)
}

export const getStartOfWeek = (date: Date): Date => {
  return startOfWeek(date, { weekStartsOn: 1 })
}

export const getStartOfMonth = (date: Date): Date => {
  return startOfMonth(date)
}

export const getStartOfYear = (date: Date): Date => {
  return startOfYear(date)
}

// Returns a string in the format of DD:HH:MM:SS, as for some reason date-fns doesn't support this...
export const timeText = (timeSeconds: number): string => {
  const time = timeSeconds * 1000

  const days = Math.floor(time / (1000 * 60 * 60 * 24))
  const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((time % (1000 * 60)) / 1000)

  let daysString = ''
  let hoursString
  let minutesString
  let secondsString

  if (days > 0) {
    daysString = `${days}D `
  }

  if (hours < 10) {
    hoursString = `0${hours}`
  } else {
    hoursString = hours.toString()
  }

  if (minutes < 10) {
    minutesString = `0${minutes}`
  } else {
    minutesString = minutes.toString()
  }

  if (seconds < 10) {
    secondsString = `0${seconds}`
  } else {
    secondsString = seconds.toString()
  }

  return `${daysString}${hoursString}:${minutesString}:${secondsString}`
}
