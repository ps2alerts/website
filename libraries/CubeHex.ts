import { CubeHexInterface } from "~/interfaces/mapping/CubeHexInterface";

const DIRECTION_VECTORS: CubeHexInterface[] = []

export class CubeHex implements CubeHexInterface {
    q: number;
    r: number;
    s: number;
    
    constructor(q: number, r: number, s: number){
        if((q + r + s) !== 0){
            throw new RangeError("CubeHex: q + r + s != 0");
        }
        this.q = q;
        this.r = r;
        this.s = s;
    }

    to_world(hex_size: number): number[] {
        const z = hex_size * Math.sqrt(3) * (this.q + 0.5 * this.r - 0.5);
        const x = hex_size * (this.r * -(3 / 2) - 1 / 2);
        return [x, z];
    }

    corner(direction: number, hex_size: number): number[] {
        const angle = (Math.PI / 6) * (2 * direction - 1)
        const center = this.to_world(hex_size)
        return [
            Math.round((center[0] + hex_size * Math.sin(angle)) * 100) / 100, 
            Math.round(center[1] + hex_size * Math.cos(angle))
        ];
    }

    edge(direction: number, hex_size: number): number[][] {
        const indices = [[0, 1], [1, 2], [2, 3],
                         [3, 4], [4, 5], [5, 0],]
        return [
            this.corner(indices[(direction) % indices.length][0], hex_size), 
            this.corner(indices[direction % indices.length][1], hex_size)
        ];
    }

    neighbor(direction: number): CubeHexInterface {
        return this.add(DIRECTION_VECTORS[direction]);
    }

    toString(): string {
        return "CubeHex(" + 
                    this.q.toString() + ", " + 
                    this.r.toString() + ", " + 
                    this.s.toString() + 
                ")";
    }

    equals(other: CubeHexInterface): boolean {
        return this.q === other.q && this.r === other.r && this.s === other.s;
    }

    add(other: CubeHexInterface): CubeHex {
        return new CubeHex(this.q + other.q, this.r + other.r, this.s + other.s)
    }

    static fromAxialRS(r: number, s: number): CubeHex {
        return new CubeHex(-r-s, r, s);
    }
}

[
    new CubeHex(+1, 0, -1), new CubeHex(+1, -1, 0), new CubeHex(0, -1, +1),
    new CubeHex(-1, 0, +1), new CubeHex(-1, +1, 0), new CubeHex(0, +1, -1)
].forEach((hex) => { DIRECTION_VECTORS.push(hex); })