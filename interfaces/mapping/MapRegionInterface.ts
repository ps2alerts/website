import { FacilityType } from '~/constants/FacilityType';
import { Faction } from '~/constants/Faction';
import { Zone } from '~/constants/Zone';
import { CubeHexInterface } from './CubeHexInterface';

export interface MapRegionInterface {
    id: number,
    name: string,
    facilityType: FacilityType,
    badgeLocation: {x: number | undefined, y: number | undefined},
    zoneId: Zone,
    connections: Array<MapRegionInterface>,
    connectionIds: Array<number>
}

export interface MapRegionDrawingInterface 
            extends MapRegionInterface {
    badge: any,
    outline(): number[][],
    faction: Faction,
}
