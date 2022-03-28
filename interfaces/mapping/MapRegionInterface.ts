import { FacilityBadge } from '~/libraries/FacilityBadge'
import { LatLng, Point } from '~/libraries/MapWorld'
import { FacilityType } from '~/constants/FacilityType'
import { Faction } from '~/constants/Faction'
import { Zone } from '~/constants/Zone'

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
