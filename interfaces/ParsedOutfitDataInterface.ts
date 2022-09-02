import { Faction } from '~/ps2alerts-constants/faction'
import { Phase } from '~/ps2alerts-constants/outfitwars/phase'
import { World } from '~/ps2alerts-constants/world'

export interface RankingInterface {
  totalScore: number
  played: number
  wins: number
  losses: number
  tiebreaker: number
  factionRank: number
  globalRank: number
}

export interface ParsedOutfitDataInterface {
  id: string
  matchStartTime: Date
  name: string
  tag: string | null
  faction: Faction
  world: World
  round: number
  phase: Phase
  rankings: RankingInterface
  outfitImageUrl: string
  metricsString: string
  instanceId: string | null
}
