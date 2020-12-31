import { Faction } from '~/constants/Faction'
import { GlobalVehicleAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalVehicleAggregateResponseInterface'
import { VehicleStatsWithKd } from '~/interfaces/VehicleStatisticsInterface'

export interface StatisticsVehicleMetricsTableDataInterface
  extends GlobalVehicleAggregateResponseInterface {
  vehicleName: string
  vehicleFaction: Faction
  totals: VehicleStatsWithKd
}
