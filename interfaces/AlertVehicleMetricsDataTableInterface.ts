import {
  InstanceVehicleAggregateResponseInterface,
  VehicleStatsInterface,
} from '~/interfaces/aggregates/instance/InstanceVehicleAggregateResponseInterface'
import { Faction } from '~/constants/Faction'

export interface VehicleStatsWithKd extends VehicleStatsInterface {
  kd?: string
}

export interface AlertVehicleMetricsDataTableInterface
  extends InstanceVehicleAggregateResponseInterface {
  vehicleName: string
  vehicleFaction: Faction
  totals: VehicleStatsWithKd
}
