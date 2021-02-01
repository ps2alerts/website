import { FactionMetricsInterface } from '~/interfaces/FactionMetricsInterface'

export interface CombatMetricsInterface {
  kills: number
  deaths: number
  teamKills: number
  teamKilled?: number
  suicides: number
  headshots: number
  factionKills?: FactionMetricsInterface
}
