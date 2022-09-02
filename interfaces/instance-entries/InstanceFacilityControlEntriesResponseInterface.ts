import { Faction } from '@/ps2alerts-constants/faction'
import { MapControlInterface } from '~/interfaces/instance-entries/MapControlInterface'
import { OutfitwarsTerritoryResultInterface } from '~/ps2alerts-constants/interfaces/OutfitwarsTerritoryResultInterface'

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
  mapControl: MapControlInterface | OutfitwarsTerritoryResultInterface | null
}
