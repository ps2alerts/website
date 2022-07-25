import { CharacterInterface } from '~/interfaces/CharacterInterface'
import { World } from '@/ps2alerts-constants/world'
import { Bracket } from '@/ps2alerts-constants/bracket'
import { CombatMetricsInterface } from '~/interfaces/CombatMetricsInterface'

export interface GlobalCharacterAggregateResponseInterface
  extends CombatMetricsInterface {
  world: World
  bracket: Bracket
  character: CharacterInterface
}
