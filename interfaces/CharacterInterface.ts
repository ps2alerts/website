import { World } from '@/constants/World'
import { Faction } from '@/constants/Faction'
import { OutfitInterface } from '@/interfaces/OutfitInterface'

export interface CharacterInterface {
  id: string
  name: string
  faction: Faction
  world: World
  battleRank: number
  asp: number
  adjustedBattleRank: number
  outfit: OutfitInterface | null
}
