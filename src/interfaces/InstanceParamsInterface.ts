import {Bracket} from "@/constants/Bracket";
import {CommonApiParamsInterface} from "@/interfaces/CommonApiParmsInterface";
import {Faction} from "@/constants/Faction";

export interface InstanceParamsInterface extends CommonApiParamsInterface {
  bracket?: Bracket
  victor?: Faction
  timeStartedFrom?: string
  timeStartedTo?: string
}
