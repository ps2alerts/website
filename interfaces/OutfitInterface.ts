import { World } from '@/ps2alerts-constants/world'
import { Faction } from '@/ps2alerts-constants/faction'
import { CharacterInterface } from '@/interfaces/CharacterInterface'

export interface OutfitInterface {
  id: string
  name: string
  faction: Faction
  world: World
  leader: CharacterInterface['id']
  tag?: string | null
}
