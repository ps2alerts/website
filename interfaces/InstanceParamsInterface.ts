import { Bracket } from '@/ps2alerts-constants/bracket'
import { CommonApiParamsInterface } from '~/interfaces/CommonApiParmsInterface'
import { Faction } from '@/ps2alerts-constants/faction'

export interface InstanceParamsInterface extends CommonApiParamsInterface {
  bracket?: Bracket
  victor?: Faction
  timeStartedFrom?: string
  timeStartedTo?: string
}
