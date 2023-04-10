import { MapStateInterface, RawMapStateInterface } from "~/interfaces/mapping/MapStateInterface";
import { Faction } from "~/ps2alerts-constants/faction";
import { World } from "~/ps2alerts-constants/world";
import { Zone } from "~/ps2alerts-constants/zone";

export default class MapState implements MapStateInterface {
    world_id: World;
    zone_id: Zone;
    zone_instance: number;
    timestamp: Date;
    map_region_id: number;
    owning_faction_id: Faction;
    is_contested: boolean;
    contesting_faction_id: Faction;
    capture_time_ms: number;
    remaining_capture_time_ms: number;
    ctf_flags: number;
    remaining_ctf_flags: number;
    faction_population_upper_bound: { VS: number; NC: number; TR: number; NSO: number; };
    faction_population_percentage: { VS: number; NC: number; TR: number; NSO: number; };
    
    constructor(state: RawMapStateInterface) {
        this.world_id = parseInt(state.world_id)
        this.zone_id = parseInt(state.zone_id)
        this.zone_instance = parseInt(state.zone_instance)
        this.timestamp = new Date(parseInt(state.timestamp) * 1000)
        this.map_region_id = parseInt(state.map_region_id)
        this.owning_faction_id = parseInt(state.owning_faction_id)
        this.is_contested = parseInt(state.is_contested) === 1
        this.contesting_faction_id = parseInt(state.contesting_faction_id)
        this.capture_time_ms = parseInt(state.capture_time_ms)
        this.remaining_capture_time_ms = parseInt(state.remaining_capture_time_ms)
        this.ctf_flags = parseInt(state.ctf_flags)
        this.remaining_ctf_flags = parseInt(state.remaining_ctf_flags)
        this.faction_population_percentage = {
            VS: parseInt(state.faction_population_percentage.VS),
            NC: parseInt(state.faction_population_percentage.NC),
            TR: parseInt(state.faction_population_percentage.TR),
            NSO: parseInt(state.faction_population_percentage.NSO)
        }
        this.faction_population_upper_bound = {
            VS: parseInt(state.faction_population_upper_bound.VS),
            NC: parseInt(state.faction_population_upper_bound.NC),
            TR: parseInt(state.faction_population_upper_bound.TR),
            NSO: parseInt(state.faction_population_upper_bound.NSO)
        }
    }
}