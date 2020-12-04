import {CombatMetricsInterface} from "@/interfaces/CombatMetricsInterface";

export interface InstanceFactionCombatAggregateResponseInterface {
  vs: CombatMetricsInterface
  nc: CombatMetricsInterface
  tr: CombatMetricsInterface
  nso: CombatMetricsInterface
  totals: CombatMetricsInterface
}
