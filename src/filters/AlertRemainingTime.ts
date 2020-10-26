import moment, {Moment, unitOfTime} from "moment-timezone";

export const AlertRemainingTime = (start: string, duration: number, format: unitOfTime.Base = 'seconds'): number => {
  const now: Moment = moment().tz("UTC");
  const end = moment(start).tz("UTC").add(duration, 'ms');
  return end.diff(now, format);
}
