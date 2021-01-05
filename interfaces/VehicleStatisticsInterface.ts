export interface VehicleStatsInterface {
  kills?: number
  deaths?: number
  teamkills?: number
  teamkilled?: number
}

export interface VehicleStatsWithKd extends VehicleStatsInterface {
  kd: string | number
}
