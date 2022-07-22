import { Faction } from '~/constants/faction'
import { MapControlInterface } from '~/interfaces/instance-entries/MapControlInterface'

export interface InstanceFacilityControlEntriesResponseInterface {
  instance: string
  facility: number
  timestamp: string
  oldFaction: Faction
  newFaction: Faction
  durationHeld: number
  isDefence: boolean
  isInitial: boolean
  outfitCaptured?: string
  mapControl: MapControlInterface | null
}
