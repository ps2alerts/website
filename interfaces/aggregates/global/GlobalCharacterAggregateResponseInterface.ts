import { CharacterInterface } from '~/interfaces/CharacterInterface'
import { World } from '~/constants/world'
import { Bracket } from '~/constants/bracket'
import { CombatMetricsInterface } from '~/interfaces/CombatMetricsInterface'

export interface GlobalCharacterAggregateResponseInterface
  extends CombatMetricsInterface {
  world: World
  bracket: Bracket
  character: CharacterInterface
}
