import { MapRegion } from "~/libraries/MapRegion";

export interface MapDrawingInterface {
    [key: number]: MapRegion
}

export class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    arr: number[];
    constructor(r: number, g: number, b: number, a: number){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.arr = [r, g, b];
    }
    toString(): string {
        var to_return = "#";
        this.arr.forEach((val) => {
            val = Math.round(val * 255);
            if (val < 16) {
                to_return += "0";
            }
            to_return += val.toString(16)
        });
        return to_return;
    }

    static fromString(colorStr: string): Color | undefined {
        if(colorStr.length < 7 || colorStr[0] !== "#"){
            return undefined;
        }
        var r = parseInt(colorStr.slice(1, 3), 16);
        var g = parseInt(colorStr.slice(3, 5), 16);
        var b = parseInt(colorStr.slice(5, 7), 16);
        var a = 255;
        if(colorStr.length > 7){
            a = parseInt(colorStr.slice(7, 9), 16);
        }
        return new Color(r / 255, g / 255, b / 255, a / 255);
    }
}

const NS = Color.fromString("#71809666") as Color;
const VS = Color.fromString("#440E6266") as Color;
const NC = Color.fromString("#004B8066") as Color;
const TR = Color.fromString("#9E0B0F66") as Color;

const VSCutoff = Color.fromString("#2E153D66") as Color;
const NCCutoff = Color.fromString("#0F273F66") as Color;
const TRCutoff = Color.fromString("#3A000566") as Color;

const NSLink = Color.fromString("#928E9966") as Color;
const VSLink = Color.fromString("#FFB2FFCC") as Color;
const NCLink = Color.fromString("#B0FFFFCC") as Color;
const TRLink = Color.fromString("#FFBFB2CC") as Color;
const ASSAULTABLELink = Color.fromString("#EAE690CC") as Color;
const ASSAULTABLELinkBg = Color.fromString("#8B7251CC") as Color;

export const MAP_FACTION_COLORS = [ NS, VS, NC, TR, NS ]

export const MAP_CUTOFF_COLORS = [ NS, VSCutoff, NCCutoff, TRCutoff, NS ]

export const MAP_LINK_COLORS = [NSLink, VSLink, NCLink, TRLink, ASSAULTABLELink, ASSAULTABLELinkBg]

const WORLD_SIZE = 8192;

function lerp(x: number, x0: number, x1: number, y0: number, y1: number): number {
    return y0 * (1 - (x - x0) / (x1 - x0)) + y1 * ((x - x0) / (x1 - x0));
}

export class LatLng {
    lat: number;
    lng: number;
    constructor(lat: number, lng: number){
        this.lat = lat;
        this.lng = lng;
    }

    asArray(): number[] {
        return [this.lat, this.lng];
    }
}

export class Point {
    x: number;
    z: number;
    constructor(x: number, z: number){
        this.x = x;
        this.z = z;
    }

    asArray(): number[] {
        return [this.x, this.z];
    }
}

export function worldToMap(worldCoords: number[]): LatLng {
    return new LatLng(
        lerp(worldCoords[0], -WORLD_SIZE / 2, WORLD_SIZE / 2, -256, 0), 
        lerp(worldCoords[1], -WORLD_SIZE / 2, WORLD_SIZE / 2, 0, 256)
    );
}

export function mapToWorld(worldCoords: number[]): Point {
    return new Point(
        lerp(worldCoords[0], -256, 0, -WORLD_SIZE / 2, WORLD_SIZE / 2), 
        lerp(worldCoords[1], 0, 256, -WORLD_SIZE / 2, WORLD_SIZE / 2)
    )
}