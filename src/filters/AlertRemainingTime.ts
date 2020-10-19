import moment, {Moment, unitOfTime} from "moment";

export const AlertRemainingTime = function(start: string, duration: number, format: unitOfTime.Base = 'seconds'): number {
  const now: Moment = moment();
  const end = moment(start).add(duration, 'ms');

  return end.diff(now, format);
}
