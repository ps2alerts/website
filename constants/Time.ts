export const DATE_FORMAT = 'dd/MMM/yy'
export const DATE_FORMAT_SHORT = 'dd/MM/yy'
export const DATE_FORMAT_ISO = 'yyyy-MM-dd'
export const DATE_TIME_FORMAT = 'do MMM yyyy HH:mm:ss'
export const DATE_TIME_FORMAT_SHORT = 'dd/MMM/yy HH:mm'
export const TIME_FORMAT = 'HH:mm:ss'
export const TIME_FORMAT_SHORT = 'HH:mm'
export const UNIX_SECONDS = 't'
export const UNIX_MILLISECONDS = 'T'
export enum TIME_GRANULARITY {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}
export type DATETIME_FORMATS =
  | typeof DATE_FORMAT
  | typeof DATE_FORMAT_SHORT
  | typeof DATE_FORMAT_ISO
  | typeof DATE_TIME_FORMAT
  | typeof DATE_TIME_FORMAT_SHORT
  | typeof TIME_FORMAT
  | typeof TIME_FORMAT_SHORT
  | typeof UNIX_SECONDS
  | typeof UNIX_MILLISECONDS
