import { Faction } from "~/ps2alerts-constants/faction"
import { World } from "~/ps2alerts-constants/world"
import { Zone } from "~/ps2alerts-constants/zone"


export interface MapStateInterface {
    world_id: World,
    zone_id: Zone,
    zone_instance: number,
    timestamp: Date,
    map_region_id: number,
    owning_faction_id: Faction,
    is_contested: boolean,
    contesting_faction_id: Faction,
    capture_time_ms: number,
    remaining_capture_time_ms: number,
    ctf_flags: number,
    remaining_ctf_flags: number,
    faction_population_upper_bound: {
        VS: number,
        NC: number,
        TR: number,
        NSO: number
    },
    faction_population_percentage: {
        VS: number,
        NC: number,
        TR: number,
        NSO: number
    }
}

export interface RawMapStateInterface {
    world_id: string,
    zone_id: string,
    zone_instance: string,
    timestamp: string,
    map_region_id: string,
    owning_faction_id: string,
    is_contested: string,
    contesting_faction_id: string,
    capture_time_ms: string,
    remaining_capture_time_ms: string,
    ctf_flags: string,
    remaining_ctf_flags: string,
    faction_population_upper_bound: {
        VS: string,
        NC: string,
        TR: string,
        NSO: string
    },
    faction_population_percentage: {
        VS: string,
        NC: string,
        TR: string,
        NSO: string
    }
}

export interface LithaFalconMapStateResponseInterface {
    map_state_list: RawMapStateInterface[]
    returned: number
}