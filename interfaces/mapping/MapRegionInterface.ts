import { FacilityType } from '~/constants/FacilityType';
import { Faction } from '~/constants/Faction';
import { Zone } from '~/constants/Zone';
import { FacilityBadge } from '../FacilityBadge';
import { CubeHexInterface } from './CubeHexInterface';
import { Point } from './MapDrawingInterface';

export interface MapRegionInterface {
    id: number,
    name: string,
    facilityType: FacilityType,
    badgeLocation: Point,
    zoneId: Zone,
    connections: Array<MapRegionInterface>,
    connectionIds: Array<number>
}

export interface MapRegionDrawingInterface 
            extends MapRegionInterface {
    badge: FacilityBadge,
    outline(): number[][],
    faction: Faction,
}
