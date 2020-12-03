import moment from "moment";

export const AlertEndTime = function(start: string, duration: number, format = 'x'): string {
  return moment(start).add(duration, 'ms').format(format);
}
