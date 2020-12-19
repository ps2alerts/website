import { Faction } from '@/constants/Faction'

export interface VehicleStatsInterface {
  kills?: number
  deaths?: number
  teamkills?: number
  teamkilled?: number
}

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
