import { differenceInDays } from 'date-fns'
import { DATE_FORMAT_ISO, TIME_GRANULARITY } from '~/constants/Time'
import {
  formatDateTime,
  getStartOfDay,
  getStartOfMonth,
  getStartOfWeek,
  getStartOfYear,
} from '~/utilities/TimeHelper'

// Helpers for time-series charts that must stay readable however many years of data they cover:
// bucket the points coarsely enough to keep the count sane, then draw averages and trends over them.

export const AUTO_GRANULARITY = 'auto'
export type ChartResolution = TIME_GRANULARITY | typeof AUTO_GRANULARITY

const TARGET_POINTS = 90

// Coarsest granularity that still gives a few dozen points across the span
export const pickGranularity = (from: Date, to: Date): TIME_GRANULARITY => {
  const days = Math.max(differenceInDays(to, from), 1)

  if (days <= TARGET_POINTS) {
    return TIME_GRANULARITY.DAY
  }

  if (days / 7 <= TARGET_POINTS) {
    return TIME_GRANULARITY.WEEK
  }

  if (days / 30 <= TARGET_POINTS) {
    return TIME_GRANULARITY.MONTH
  }

  return TIME_GRANULARITY.YEAR
}

export const bucketStart = (
  date: Date,
  granularity: TIME_GRANULARITY
): Date => {
  switch (granularity) {
    case TIME_GRANULARITY.WEEK:
      return getStartOfWeek(date)
    case TIME_GRANULARITY.MONTH:
      return getStartOfMonth(date)
    case TIME_GRANULARITY.YEAR:
      return getStartOfYear(date)
    default:
      return getStartOfDay(date)
  }
}

export const bucketKey = (date: Date, granularity: TIME_GRANULARITY): string =>
  formatDateTime(bucketStart(date, granularity), DATE_FORMAT_ISO)

export const bucketLabel = (
  key: string,
  granularity: TIME_GRANULARITY
): string => {
  const date = new Date(key)

  switch (granularity) {
    case TIME_GRANULARITY.YEAR:
      return formatDateTime(date, 'yyyy' as never)
    case TIME_GRANULARITY.MONTH:
      return formatDateTime(date, 'MMM yy' as never)
    default:
      return formatDateTime(date, 'dd MMM yy' as never)
  }
}

export const granularityNoun = (granularity: TIME_GRANULARITY): string =>
  granularity === TIME_GRANULARITY.DAY ? 'day' : granularity

// Trailing average over the previous `window` points (inclusive)
export const rollingAverage = (values: number[], window: number): number[] => {
  const size = Math.max(1, Math.floor(window))

  return values.map((_, index) => {
    const slice = values.slice(Math.max(0, index - size + 1), index + 1)
    return slice.reduce((sum, value) => sum + value, 0) / slice.length
  })
}

// Least-squares straight line through the series, one value per point
export const linearTrend = (values: number[]): number[] => {
  const n = values.length

  if (n < 2) {
    return [...values]
  }

  const meanX = (n - 1) / 2
  const meanY = values.reduce((sum, value) => sum + value, 0) / n
  let numerator = 0
  let denominator = 0

  values.forEach((value, x) => {
    numerator += (x - meanX) * (value - meanY)
    denominator += (x - meanX) ** 2
  })

  const slope = denominator === 0 ? 0 : numerator / denominator
  const intercept = meanY - slope * meanX

  return values.map((_, x) => intercept + slope * x)
}

// Point markers only earn their place when there are few enough to tell apart
export const pointRadiusFor = (pointCount: number): number => {
  if (pointCount > 60) {
    return 0
  }

  return pointCount > 30 ? 2 : 3
}
