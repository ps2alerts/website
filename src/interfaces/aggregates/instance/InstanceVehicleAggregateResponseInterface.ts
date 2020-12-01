import {Faction} from "@/constants/Faction";

interface VehicleStatsInterface {
  kills?: number;
  deaths?: number;
  teamkills?: number;
  teamkilled?: number;
}

export interface InstanceVehicleAggregateResponseInterface {
  instanceId: string;
  vehicle: number;
  vehicleName?: string;
  vehicleFaction?: Faction;
  vehicleDeathMatrix?: {[k:string]: number};
  vehicleKillMatrix?: {[k:string]: number};
  suicides?: number;
  vehicles?: VehicleStatsInterface;
  infantry?: VehicleStatsInterface;
  totals?: {
    kills: number;
    deaths: number;
    teamkills: number;
    teamkilled: number;
  }
}
