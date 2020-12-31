import { CombatMetricsInterface } from '@/interfaces/CombatMetricsInterface'
import { World } from '~/constants/World'
import { Loadout } from '~/constants/Loadout'

export interface GlobalLoadoutAggregateResponseInterface
  extends CombatMetricsInterface {
  world: World
  loadout: Loadout
}
