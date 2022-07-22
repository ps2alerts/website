import { World } from '~/constants/world'
import { Bracket } from '~/constants/bracket'
import { CombatMetricsInterface } from '~/interfaces/CombatMetricsInterface'
import { OutfitInterface } from '~/interfaces/OutfitInterface'

export interface GlobalOutfitAggregateResponseInterface
  extends CombatMetricsInterface {
  world: World
  bracket: Bracket
  outfit: OutfitInterface
  captures?: number
}
