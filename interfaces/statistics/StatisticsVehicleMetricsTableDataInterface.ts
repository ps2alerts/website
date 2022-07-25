import { Faction } from '@/ps2alerts-constants/faction'
import { GlobalVehicleAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalVehicleAggregateResponseInterface'
import { VehicleStatsWithKd } from '~/interfaces/VehicleStatisticsInterface'
import { Vehicle } from '@/ps2alerts-constants/vehicle'

export interface StatisticsVehicleMetricsTableDataInterface
  extends GlobalVehicleAggregateResponseInterface {
  vehicleId: Vehicle
  vehicleName: string
  vehicleFaction: Faction
  totals: VehicleStatsWithKd
}
