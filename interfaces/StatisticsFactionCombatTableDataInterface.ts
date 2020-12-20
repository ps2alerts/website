import { GlobalCombatMetricsInterface } from '~/interfaces/aggregates/global/GlobalFactionCombatAggregateResponseInterface'
import { Faction } from '~/constants/Faction'

export interface StatisticsFactionCombatTableDataInterface
  extends GlobalCombatMetricsInterface {
  uuid: string
  worldName: string
  factionId: Faction
  factionName: string
}
