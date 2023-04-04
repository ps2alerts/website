import { OutfitWarsTeamsInterface } from './OutfitWarsTeamsInterface'
import { Phase } from '~/ps2alerts-constants/outfitwars/phase'

export interface OutfitWarsMetadataInterface {
  phase: Phase
  round: number
  teams?: OutfitWarsTeamsInterface
}
