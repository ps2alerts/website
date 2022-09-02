import { Phase } from '@/ps2alerts-constants/outfitwars/phase'
import { CommonApiParamsInterface } from '~/interfaces/CommonApiParmsInterface'
import { Team } from '@/ps2alerts-constants/outfitwars/team'
import { Faction } from '~/ps2alerts-constants/faction'

export interface OutfitWarsParamsInterface extends CommonApiParamsInterface {
  phase?: Phase
  round?: number
  victor?: Team
  redTeamFaction?: Faction
  blueTeamFaction?: Faction
  outfitNameOrTag?: string
  timeStartedFrom?: string
  timeStartedTo?: string
}
