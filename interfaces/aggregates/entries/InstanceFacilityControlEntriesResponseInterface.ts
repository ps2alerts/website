import { Faction } from '~/constants/Faction'

export interface InstanceFacilityControlEntriesResponseInterface {
  instance: string
  facility: number
  timestamp: string
  oldFaction: Faction
  newFaction: Faction
  durationHeld: number
  isDefence: boolean
  outfitCaptured: string
}
