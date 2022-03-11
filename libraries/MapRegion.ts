import { FacilityType } from "~/constants/FacilityType";
import { Faction } from "~/constants/Faction";
import getIndarConstructionOutpost from "~/constants/IndarConstructionOutpostData";
import { Zone, ZoneHexSize } from "~/constants/Zone";
import { CensusMapRegionInterface } from "~/interfaces/mapping/CensusMapRegionInterface";
import { CubeHexInterface } from "~/interfaces/mapping/CubeHexInterface";
import { LatLng, worldToMap } from "~/interfaces/mapping/MapDrawingInterface";
import { MapRegionDrawingInterface } from "~/interfaces/mapping/MapRegionInterface";
import { CubeHex } from "./CubeHex";

export class CubeHexIndices {
    q: number;
    r: number;
    s: number;
    locations: number[][];
    constructor(hex: CubeHex, hex_size: number){
        this.q = hex.q;
        this.r = hex.r;
        this.s = hex.s;
        this.locations = [];
        for(var i = 0; i < 3; i++){
            this.locations.push(hex.indexLoc(i, hex_size));
        }
    }

}

export class MapRegion implements MapRegionDrawingInterface {
    badge: any;
    faction: Faction;
    id: number;
    name: string;
    facilityType: FacilityType;
    badgeLocation: { x: number; y: number; };
    zoneId: Zone;
    connections: MapRegion[];
    connectionIds: number[];
    hexes: CubeHex[];
    indices: CubeHexIndices[];
    private cutoff: boolean;
    private outline_cache: number[][];
    private hexSet: Record<string, CubeHex>;
    
    constructor(region: CensusMapRegionInterface, zone: Zone){
        this.hexSet = {};
        this.id = parseInt(region.facility_id, 10);
        this.name = region.facility_name;
        this.facilityType = parseInt(region.facility_type_id, 10);
        this.indices = [];

        //Fun data injections for the whole family
        const outpost = getIndarConstructionOutpost(this.id);
        if(this.name === "Berjess Overlook"){
            console.log(outpost);
        }
        if (outpost !== null) {
            this.badgeLocation = {
                x: outpost.location_x,
                y: outpost.location_z
            };
        } else {
            this.badgeLocation = {
                x: region.location_x ? parseFloat(region.location_x) : 0,
                y: region.location_z ? parseFloat(region.location_z) : 0,
            };
        }
        this.zoneId = zone;
        this.connections = [];

        this.connectionIds = [];
        region.facility_links?.forEach((link) => {
            this.connectionIds.push(parseInt(link.facility_id_b))
        });

        this.hexes = [];
        region.map_hexes.forEach((hex) => {
            var r: number = -parseInt(hex.y) - 1;
            var s: number = -parseInt(hex.x);
            var cubehex = CubeHex.fromAxialRS(r, s);
            this.hexes.push(cubehex);
            this.indices.push(new CubeHexIndices(cubehex, ZoneHexSize(this.zoneId)));
        });

        this.faction = Faction.NONE;
        this.outline_cache = [];
        this.cutoff = false;
    }

    setCutoff(newVal: boolean): void {
        this.cutoff = newVal;
    }

    isCutoff(): boolean {
        return this.cutoff;
    }

    hexIndices(): CubeHexIndices[] {
        return this.indices;
    }

    contains(point: number[]): boolean {
        var toFind = CubeHex.fromWorld(point[0], point[1], ZoneHexSize(this.zoneId));
        return this.hexSet[toFind.toString()] !== undefined;
    }

    outline(): number[][] {
        if(this.outline_cache.length > 0 || this.hexes.length == 0){
            return this.outline_cache;
        }
        var pile: number[][][] = [];
        this.hexes.forEach((hex) => {
            this.hexSet[hex.toString()] = hex;
        });
        this.hexes.forEach((hex) => {
            for(var dir = 0; dir < 6; dir++){
                if(!this.hexSet[hex.neighbor(dir).toString()]){
                    pile.push(hex.edge(dir, ZoneHexSize(this.zoneId)));
                }
            }
        });

        var edge = pile.shift();
        if(!edge){
            return this.outline_cache;
        }
        this.outline_cache.push(edge[0]);
        this.outline_cache.push(edge[1]);
        while(pile.length !== 0){
            edge = pile.shift();
            if(!edge){
                return this.outline_cache;
            }
            var pointIndices = [-1, -1];
            for(var i = 0; i < this.outline_cache.length; i++){
                if(Math.abs(this.outline_cache[i][0] - edge[0][0]) < 0.1 && 
                    Math.abs(this.outline_cache[i][1] - edge[0][1]) < 0.1){
                    pointIndices[0] = i;
                }
                if(Math.abs(this.outline_cache[i][0] - edge[1][0]) < 0.1 && 
                    Math.abs(this.outline_cache[i][1] - edge[1][1]) < 0.1){
                    pointIndices[1] = i;
                }
                if(pointIndices[0] !== -1 && pointIndices[1] !== -1){
                    break;
                }
            }
            if (pointIndices[0] !== -1 && pointIndices[1] !== -1) {
                continue;
            }
            if (pointIndices[0] !== -1) {
                if(pointIndices[0] + 1 == this.outline_cache.length){
                    pointIndices[0] = -1;
                }
                this.outline_cache.splice(pointIndices[0] + 1, 0, edge[1]);
            } else if(pointIndices[1] !== -1){
                if(pointIndices[1] == 0){
                    pointIndices[1] = this.outline_cache.length;
                }
                this.outline_cache.splice(pointIndices[1], 0, edge[0]);
            } else {
                pile.push(edge);
            }
        }
        return this.outline_cache;
    }
    
}