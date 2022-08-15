import { Faction } from '@/ps2alerts-constants/faction'
import { MapControlInterface } from '~/interfaces/instance-entries/MapControlInterface'
import { OWMapControlInterface } from './OWMapControlInterface'

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
  mapControl: MapControlInterface | OWMapControlInterface | null
}
