import { World } from '@/ps2alerts-constants/world'
import { Bracket } from '@/ps2alerts-constants/bracket'
import { CombatMetricsInterface } from '~/interfaces/CombatMetricsInterface'
import { OutfitInterface } from '~/interfaces/OutfitInterface'

export interface GlobalOutfitAggregateResponseInterface
  extends CombatMetricsInterface {
  world: World
  bracket: Bracket
  outfit: OutfitInterface
  captures?: number
}
