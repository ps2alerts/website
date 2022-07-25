import { CombatMetricsInterface } from '@/interfaces/CombatMetricsInterface'
import { World } from '@/ps2alerts-constants/world'

export interface GlobalCombatMetricsInterface extends CombatMetricsInterface {
  hsr: string | number
  kd: string | number
  teamkillPercent?: string | number
}

export interface GlobalFactionCombatAggregateResponseInterface {
  world: World
  vs: GlobalCombatMetricsInterface
  nc: GlobalCombatMetricsInterface
  tr: GlobalCombatMetricsInterface
  nso: GlobalCombatMetricsInterface
  totals: GlobalCombatMetricsInterface
}
