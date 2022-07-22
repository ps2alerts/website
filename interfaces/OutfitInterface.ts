import { World } from '@/constants/world'
import { Faction } from '@/constants/faction'
import { CharacterInterface } from '@/interfaces/CharacterInterface'

export interface OutfitInterface {
  id: string
  name: string
  faction: Faction
  world: World
  leader: CharacterInterface['id']
  tag?: string | null
}
