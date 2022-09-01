import { Phase } from '@/ps2alerts-constants/outfitwars/phase'
import { CommonApiParamsInterface } from '~/interfaces/CommonApiParmsInterface'
import { Team } from '@/ps2alerts-constants/outfitwars/team'

export interface OutfitWarsParamsInterface extends CommonApiParamsInterface {
  phase?: Phase
  round?: number
  victor?: Team
  timeStartedFrom?: string
  timeStartedTo?: string
}
