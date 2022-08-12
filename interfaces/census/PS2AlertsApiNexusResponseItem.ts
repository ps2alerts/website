/* eslint-disable camelcase */
export interface PS2AlertsApiNexusResponseItem {
    map_region_id: string
    facility_id: string
    facility_name: string
    facility_type_id: string
    facility_type: string
    location_x: string
    location_z: string
    facility_links: {
        facility_id_b: string
        map_region: {
            map_region_id: string
        }
    }[]
    map_hexes: {
        x: string
        y: string
    }[]
}