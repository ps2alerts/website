import { CombatMetricsInterface } from '@/interfaces/CombatMetricsInterface'
import { World } from '@/ps2alerts-constants/world'
import { Loadout } from '@/ps2alerts-constants/loadout'

export interface GlobalLoadoutAggregateResponseInterface
  extends CombatMetricsInterface {
  world: World
  loadout: Loadout
}
