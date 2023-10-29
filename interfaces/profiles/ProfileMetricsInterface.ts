import { InstanceCharacterInterface } from '~/ps2alerts-constants/interfaces/api-responses/InstanceCharacterInterface'

export interface ProfileCommonMetricsInterface {
  kills?: number | string
  deaths?: number | string
  teamKills?: number | string
  teamKilled?: number | string
  suicides?: number | string
  headshots?: number | string
  kd: string // Calculated
  hsr: string // Calculated
  tkr: string // Calculated
  tkedr: string // Calculated
  suir: string // Calculated
  kpm: string // Calculated
  dpm: string // Calculated
  xpmBracketCount?: number
  bracket: string
  bracketCount: number
  // factionKills: PS2AlertsFactionKillDataInterface
  [key: string]: any
}

export interface BracketedProfileCommonMetricsInterface {
  [bracket: number]: ProfileCommonMetricsInterface | null
}

export interface ProfileMetricsInterface {
  brackets: BracketedProfileCommonMetricsInterface
  averages: BracketedProfileCommonMetricsInterface
  // lastXAlertsPerformance: ProfileCommonMetricsInterface
  alerts: InstanceCharacterInterface[]
}
