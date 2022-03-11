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
        const angle = (Math.PI / 6) * (2 * direction - 1);
        const center = this.to_world(hex_size)
        return [
            Math.round((center[0] + hex_size * Math.sin(angle)) * 100) / 100, 
            Math.round(center[1] + hex_size * Math.cos(angle))
        ];
    }

    edge(direction: number, hex_size: number): number[][] {
        const indices = [[0, 1], [1, 2], [2, 3],
                         [3, 4], [4, 5], [5, 0],]
        direction = direction % indices.length;
        if(direction < 0){
            direction += 6;
        }
        return [
            this.corner(indices[direction % indices.length][0], hex_size), 
            this.corner(indices[direction % indices.length][1], hex_size)
        ];
    }

    indexLoc(index: number, hex_size: number): number[] {
        var edge = this.edge(-2 * index + 2, hex_size);
        var center = this.to_world(hex_size);
        return [
            (((edge[0][0] + edge[1][0]) / 2) * 3 + center[0]) / 4,
            (((edge[0][1] + edge[1][1]) / 2) * 3 + center[1]) / 4,
        ]
    }

    vertices(hex_size: number): number[][] {
        var to_return: number[][] = [];
        for(var i = 0; i < 6; i++){
            to_return.push(this.corner(i, hex_size));
        }
        return to_return;
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

    round(): CubeHex {
        var q = Math.round(this.q);
        var r = Math.round(this.r);
        var s = Math.round(this.s);

        var q_diff = Math.abs(q - this.q);
        var r_diff = Math.abs(r - this.r);
        var s_diff = Math.abs(s - this.s);

        if(q_diff > r_diff && q_diff > s_diff){
            q = -r - s;
        } else if(r_diff > s_diff){
            r = -q - s;
        } else {
            s = -q - r;
        }
        return new CubeHex(q, r, s);
    }

    static fromWorld(x: number, y: number, hex_size: number): CubeHex {
        var q = (Math.sqrt(3) * y + x) / (3 * hex_size) + (2 / 3);
        var r = -2 / 3 * (x / hex_size + 0.5);
        var s = -q - r;

        return new CubeHex(q, r, s).round();
    }
}

[
    new CubeHex(+1, 0, -1), new CubeHex(+1, -1, 0), new CubeHex(0, -1, +1),
    new CubeHex(-1, 0, +1), new CubeHex(-1, +1, 0), new CubeHex(0, +1, -1)
].forEach((hex) => { DIRECTION_VECTORS.push(hex); })