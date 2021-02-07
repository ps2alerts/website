import { CombatMetricsInterface } from '@/interfaces/CombatMetricsInterface'
import { FactionVsFactionDataInterface } from '~/interfaces/FactionVsFactionDataInterface'

export interface InstanceFactionCombatAggregateResponseInterface {
  vs: CombatMetricsInterface
  nc: CombatMetricsInterface
  tr: CombatMetricsInterface
  nso: CombatMetricsInterface
  totals: CombatMetricsInterface
  factionKills: FactionVsFactionDataInterface
}
