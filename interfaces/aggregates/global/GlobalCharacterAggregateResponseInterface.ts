import { CharacterInterface } from '~/interfaces/CharacterInterface'
import { World } from '~/constants/World'
import { Bracket } from '~/constants/Bracket'

export interface GlobalCharacterAggregateResponseInterface {
  world: World
  bracket: Bracket
  character: CharacterInterface
  kills?: number
  deaths?: number
  teamKills?: number
  suicides?: number
  headshots?: number
}
