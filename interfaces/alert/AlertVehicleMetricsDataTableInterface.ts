import { InstanceVehicleAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceVehicleAggregateResponseInterface'
import { Faction } from '~/constants/Faction'
import { VehicleStatsWithKd } from '~/interfaces/VehicleStatisticsInterface'

export interface AlertVehicleMetricsDataTableInterface
  extends InstanceVehicleAggregateResponseInterface {
  vehicleName: string
  vehicleFaction: Faction
  totals: VehicleStatsWithKd
}
