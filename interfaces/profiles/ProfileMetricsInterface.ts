import { Bracket } from '~/ps2alerts-constants/bracket'
import { Faction } from '~/ps2alerts-constants/faction'
import { World } from '~/ps2alerts-constants/world'
import { Zone } from '~/ps2alerts-constants/zone'
import { Ps2AlertsEventState } from '~/ps2alerts-constants/ps2AlertsEventState'
import { PS2AlertsOutfitInterface } from '~/ps2alerts-constants/interfaces/PS2AlertsOutfitInterface'
import { GlobalCharacterAggregateInterface } from '~/ps2alerts-constants/interfaces/api-responses/GlobalCharacterAggregateInterface'
import { GlobalOutfitAggregateInterface } from '~/ps2alerts-constants/interfaces/api-responses/GlobalOutfitAggregateInterface'

// Shapes returned by the API's /profiles endpoints, which do all the aggregation server-side

export type ProfileType = 'character' | 'outfit'

export type TimelineGranularity = 'day' | 'week' | 'month' | 'year'

export interface FactionKillsInterface {
  vs: number
  nc: number
  tr: number
  nso: number
}

export interface ProfileBracketTotalsInterface {
  bracket: Bracket
  alerts: number
  kills: number
  deaths: number
  headshots: number
  teamKills: number
  teamKilled: number
  suicides: number
  captures: number
  participants: number
  xpmAlerts: number
  kpm: number
  dpm: number
  tkpm: number
  spm: number
  hspm: number
  ppKpm: number
  ppDpm: number
  wins: number
  decided: number
  factionKills: FactionKillsInterface
}

export interface ProfileSummaryInterface {
  type: ProfileType
  id: string
  world: World
  days: number | null
  identity: GlobalCharacterAggregateInterface | GlobalOutfitAggregateInterface
  faction: Faction
  leader?: { id: string; name: string; world: World } | null
  totals: ProfileBracketTotalsInterface
  brackets: Record<number, ProfileBracketTotalsInterface | undefined>
  firstAlert: string | null
  lastAlert: string | null
  firstTrackedAlert: string | null
}

export interface ProfileTimelineRowInterface {
  bucket: string
  bracket: Bracket
  alerts: number
  kills: number
  deaths: number
  headshots: number
  teamKills: number
  teamKilled: number
  suicides: number
  xpmAlerts: number
  kpmTotal: number
  dpmTotal: number
}

export interface ProfileAlertRowInterface {
  instance: string
  kills?: number
  deaths?: number
  headshots?: number
  teamKills?: number
  teamKilled?: number
  suicides?: number
  participants?: number
  battleRank?: number
  outfit?: PS2AlertsOutfitInterface
  details: {
    world: World
    zone: Zone
    bracket: Bracket
    state: Ps2AlertsEventState
    timeStarted: string
    timeEnded: string | null
    victor: Faction | null
    draw: boolean
  } | null
}

export interface ProfileAlertsPageInterface {
  items: ProfileAlertRowInterface[]
  total: number
  page: number
  pageSize: number
}

// Everything a profile page has loaded, handed down to the layout
export interface ProfileDataInterface {
  type: ProfileType
  id: string
  world: World
  days: number | null
  summary: ProfileSummaryInterface
}

export interface ProfileMemberRowInterface {
  character: {
    id: string
    name: string
    faction: Faction
    world: World
    battleRank: number
    adjustedBattleRank?: number
    asp?: number
  }
  kills?: number
  deaths?: number
  headshots?: number
  teamKills?: number
  suicides?: number
}

export interface ProfileMembersPageInterface {
  items: ProfileMemberRowInterface[]
  total: number
  page: number
  pageSize: number
}

export interface ProfileVehicleRowInterface {
  vehicle: number
  vehicleKills: number
  infantryKills: number
  deaths: number
  teamKills: number
  teamKilled: number
  roadkills: number
  suicides: number
}
