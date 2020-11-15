import {Bracket} from "@/constants/Bracket";
import {CommonApiParamsInterface} from "@/interfaces/CommonApiParmsInterface";
import {Moment} from "moment";

export interface InstanceParamsInterface extends CommonApiParamsInterface {
  bracket?: Bracket
  timeStartedFrom?: Moment
  timeStartedTo?: Moment
}
