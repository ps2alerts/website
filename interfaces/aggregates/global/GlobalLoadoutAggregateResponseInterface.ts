import { CombatMetricsInterface } from '@/interfaces/CombatMetricsInterface'
import { World } from '~/constants/world'
import { Loadout } from '~/constants/loadout'

export interface GlobalLoadoutAggregateResponseInterface
  extends CombatMetricsInterface {
  world: World
  loadout: Loadout
}
