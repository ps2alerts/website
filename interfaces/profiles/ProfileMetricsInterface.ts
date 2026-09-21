import { CombatMetricsInterface } from '~/ps2alerts-constants/interfaces/CombatMetricsInterface'
import { PS2AlertsTerritoryInstanceInterface } from '~/ps2alerts-constants/interfaces/PS2AlertsTerritoryInstanceInterface'
import { XPerMinuteInterface } from '~/ps2alerts-constants/interfaces/api-responses/InstanceCharacterInterface'
import { PS2AlertsCharacterInterface } from '~/ps2alerts-constants/interfaces/PS2AlertsCharacterInterface'
import { PS2AlertsOutfitInterface } from '~/ps2alerts-constants/interfaces/PS2AlertsOutfitInterface'
import { Bracket } from '~/ps2alerts-constants/bracket'
import { Faction } from '~/ps2alerts-constants/faction'
import TerritoryResultInterface from '~/ps2alerts-constants/interfaces/TerritoryResultInterface'

// The constants' result interface stops short of the victor, which the API does send
export interface ProfileInstanceDetailsInterface
  extends Omit<PS2AlertsTerritoryInstanceInterface, 'result'> {
  result?: TerritoryResultInterface & {
    victor?: Faction | null
    draw?: boolean
  }
}

// A per-alert aggregate for either a character or an outfit, as returned by the instance aggregate endpoints
export interface ProfileAlertInterface extends CombatMetricsInterface {
  instance: string
  instanceDetails?: ProfileInstanceDetailsInterface
  xPerMinutes?: XPerMinuteInterface
  character?: PS2AlertsCharacterInterface
  outfit?: PS2AlertsOutfitInterface
  participants?: number
  [key: string]: any
}

// The all-time aggregate for a single bracket, from the global aggregate endpoints
export interface ProfileGlobalAggregateInterface
  extends CombatMetricsInterface {
  bracket: Bracket
  [key: string]: any
}

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
  [key: string]: any
}

export interface BracketedProfileCommonMetricsInterface {
  [bracket: number]: ProfileCommonMetricsInterface | null
}

export interface ProfileMetricsInterface {
  brackets: BracketedProfileCommonMetricsInterface
  averages: BracketedProfileCommonMetricsInterface
  alerts: ProfileAlertInterface[]
}

export type ProfileType = 'player' | 'outfit'
