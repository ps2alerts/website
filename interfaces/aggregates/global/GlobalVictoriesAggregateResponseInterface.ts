import { Zone } from '@/constants/zone'
import { Bracket } from '~/constants/bracket'
import { World } from '~/constants/world'

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
