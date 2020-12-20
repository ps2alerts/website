import { GlobalCombatMetricsInterface } from '~/interfaces/aggregates/global/GlobalFactionCombatAggregateResponseInterface'

export interface StatisticsFactionCombatTableDataInterface
  extends GlobalCombatMetricsInterface {
  uuid: string
  worldName: string
  factionName: string
}
