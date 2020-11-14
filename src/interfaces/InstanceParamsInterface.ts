import {Bracket} from "@/constants/Bracket";
import {CommonApiParamsInterface} from "@/interfaces/CommonApiParmsInterface";

export interface InstanceParamsInterface extends CommonApiParamsInterface {
  bracket?: Bracket
  timeStarted?: object
}
