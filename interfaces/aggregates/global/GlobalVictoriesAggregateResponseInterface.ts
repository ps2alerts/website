import { Zone } from '@/ps2alerts-constants/zone'
import { Bracket } from '@/ps2alerts-constants/bracket'
import { World } from '@/ps2alerts-constants/world'

export interface GlobalVictoriesAggregateResponseInterface {
  world: World
  zone: Zone
  bracket: Bracket
  date: string
  vs: number
  nc: number
  tr: number
  draws: number
}
