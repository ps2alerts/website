import { InstanceVehicleAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceVehicleAggregateResponseInterface'
import { Faction } from '@/ps2alerts-constants/faction'
import { VehicleStatsWithKd } from '~/interfaces/VehicleStatisticsInterface'

export interface AlertVehicleMetricsDataTableInterface
  extends InstanceVehicleAggregateResponseInterface {
  vehicleName: string
  vehicleFaction: Faction
  totals: VehicleStatsWithKd
}
