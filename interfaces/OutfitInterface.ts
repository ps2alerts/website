import { World } from '@/constants/World'
import { Faction } from '@/constants/Faction'
import { CharacterInterface } from '@/interfaces/CharacterInterface'

export interface OutfitInterface {
  id: string
  name: string
  faction: Faction
  world: World
  leader: CharacterInterface['id']
  tag?: string | null
}
