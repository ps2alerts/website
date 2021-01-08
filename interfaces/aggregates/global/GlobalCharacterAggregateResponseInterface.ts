import { CharacterInterface } from '~/interfaces/CharacterInterface'
import { World } from '~/constants/World'
import { Bracket } from '~/constants/Bracket'
import { CombatMetricsInterface } from '~/interfaces/CombatMetricsInterface'

export interface GlobalCharacterAggregateResponseInterface
  extends CombatMetricsInterface {
  world: World
  bracket: Bracket
  character: CharacterInterface
}
