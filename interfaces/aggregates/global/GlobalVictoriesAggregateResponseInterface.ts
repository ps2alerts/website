import { Zone } from '~/constants/Zone'
import { Bracket } from '~/constants/Bracket'
import { World } from '~/constants/World'

export interface GlobalVictoriesAggregateResponseInterface {
  world: World
  zone: Zone
  bracket: Bracket
  vs: number
  nc: number
  tr: number
  draws: number
}
