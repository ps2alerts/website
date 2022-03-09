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
}

const NS = new Color(
    0.443,
    0.502,
    0.588,
    0.4,
);

const VS = new Color (
    0.267,
    0.055,
    0.384,
    0.4
);

const NC = new Color  (
    0.0,
    0.294,
    0.5,
    0.4
);

const TR = new Color (
    0.620,
    0.043,
    0.059,
    0.4
);

export const MAP_FACTION_COLORS = [ NS, VS, NC, TR, NS ]

const WORLD_SIZE = 8192;

function lerp(x: number, x0: number, x1: number, y0: number, y1: number): number {
    return y0 * (1 - (x - x0) / (x1 - x0)) + y1 * ((x - x0) / (x1 - x0));
}

export interface LatLng {
    lat: number,
    lng: number
}

export function worldToMap(worldCoords: number[]): LatLng {
    return {
        lat: lerp(worldCoords[0], -WORLD_SIZE / 2, WORLD_SIZE / 2, -256, 0), 
        lng: lerp(worldCoords[1], -WORLD_SIZE / 2, WORLD_SIZE / 2, 0, 256)
    }
}