import { Faction } from '@/ps2alerts-constants/faction'
import { World } from '@/ps2alerts-constants/world'
import { Vehicle } from '@/ps2alerts-constants/vehicle'

interface VehicleStatsInterface {
  kills?: number
  deaths?: number
  teamkills?: number
  teamkilled?: number
}

export interface GlobalVehicleAggregateResponseInterface {
  world: World
  vehicle: Vehicle
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
