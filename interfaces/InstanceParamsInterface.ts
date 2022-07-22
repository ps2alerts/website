import { Bracket } from '~/constants/bracket'
import { CommonApiParamsInterface } from '~/interfaces/CommonApiParmsInterface'
import { Faction } from '~/constants/faction'

export interface InstanceParamsInterface extends CommonApiParamsInterface {
  bracket?: Bracket
  victor?: Faction
  timeStartedFrom?: string
  timeStartedTo?: string
}
