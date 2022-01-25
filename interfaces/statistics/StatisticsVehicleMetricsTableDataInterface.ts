import { Faction } from '~/constants/Faction'
import { GlobalVehicleAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalVehicleAggregateResponseInterface'
import { VehicleStatsWithKd } from '~/interfaces/VehicleStatisticsInterface'
import { Vehicle } from '~/constants/Vehicle'

export interface StatisticsVehicleMetricsTableDataInterface
  extends GlobalVehicleAggregateResponseInterface {
  vehicleId: Vehicle
  vehicleName: string
  vehicleFaction: Faction
  totals: VehicleStatsWithKd
}
