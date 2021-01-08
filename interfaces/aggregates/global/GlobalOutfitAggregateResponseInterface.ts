import { World } from '~/constants/World'
import { Bracket } from '~/constants/Bracket'
import { CombatMetricsInterface } from '~/interfaces/CombatMetricsInterface'
import { OutfitInterface } from '~/interfaces/OutfitInterface'

export interface GlobalOutfitAggregateResponseInterface
  extends CombatMetricsInterface {
  world: World
  bracket: Bracket
  outfit: OutfitInterface
  captures?: number
}
