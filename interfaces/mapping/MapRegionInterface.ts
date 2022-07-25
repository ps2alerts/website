import { FacilityBadge } from '~/libraries/FacilityBadge'
import { LatLng, Point } from '~/libraries/MapWorld'
import { FacilityType } from '@/ps2alerts-constants/facilityType'
import { Faction } from '@/ps2alerts-constants/faction'
import { Zone } from '@/ps2alerts-constants/zone'

export interface MapRegionInterface {
  id: number
  name: string
  facilityType: FacilityType
  badgeLocation: Point
  zoneId: Zone
  connections: Array<MapRegionInterface>
  connectionIds: Array<number>
}

export interface MapRegionDrawingInterface extends MapRegionInterface {
  badge(indicatorStamp?: number, indicatorTextStamp?: number): FacilityBadge
  outline(): LatLng[]
  faction: Faction
}
