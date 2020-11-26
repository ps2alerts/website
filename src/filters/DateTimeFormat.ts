import moment from "moment";
import {DATE_TIME_FORMAT} from "@/constants/Time";

export const DateTimeFormat = function(isoDate: string, format?: string): string {
  return moment(isoDate).format(format ? format : DATE_TIME_FORMAT);
}
