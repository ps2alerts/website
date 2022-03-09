import { CensusFacilityLinkInterface } from "./CensusFacilityLinkInterface";
import { CensusMapHexInterface } from "./CensusMapHexInterface";

export interface CensusMapRegionInterface {
    map_region_id: string,
    facility_id: string,
    facility_name: string,
    facility_type_id: string,
    location_x: string | undefined,
    location_z: string | undefined,
    facility_links: Array<CensusFacilityLinkInterface> | undefined,
    map_hexes: Array<CensusMapHexInterface>,
}