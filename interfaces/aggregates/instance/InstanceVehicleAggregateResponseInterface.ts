import { Faction } from '@/ps2alerts-constants/faction'
import { VehicleStatsInterface } from '~/interfaces/VehicleStatisticsInterface'

export interface InstanceVehicleAggregateResponseInterface {
  instanceId: string
  vehicle: number
  vehicleName?: string
  vehicleFaction?: Faction
  vehicleDeathMatrix?: { [k: string]: number }
  vehicleKillMatrix?: { [k: string]: number }
  vehicleTeamkillMatrix?: { [k: string]: number }
  vehicleTeamkilledMatrix?: { [k: string]: number }
  suicides?: number
  roadkills?: number
  vehicles?: VehicleStatsInterface
  infantry?: VehicleStatsInterface
}
