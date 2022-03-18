import { CubeHexInterface } from '~/interfaces/mapping/CubeHexInterface'

const DIRECTION_VECTORS: CubeHexInterface[] = []

export class CubeHex implements CubeHexInterface {
  q: number
  r: number
  s: number

  constructor(q: number, r: number, s: number) {
    if (q + r + s !== 0) {
      throw new RangeError('CubeHex: q + r + s != 0')
    }
    this.q = q
    this.r = r
    this.s = s
  }

  to_world(hexSize: number): number[] {
    const z = hexSize * Math.sqrt(3) * (this.q + 0.5 * this.r - 0.5)
    const x = hexSize * (this.r * -(3 / 2) - 1 / 2)
    return [x, z]
  }

  corner(direction: number, hexSize: number): number[] {
    const angle = (Math.PI / 6) * (2 * direction - 1)
    const center = this.to_world(hexSize)
    return [
      Math.round((center[0] + hexSize * Math.sin(angle)) * 100) / 100,
      Math.round(center[1] + hexSize * Math.cos(angle)),
    ]
  }

  edge(direction: number, hexSize: number): number[][] {
    const indices = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
    ]
    direction = direction % indices.length
    if (direction < 0) {
      direction += 6
    }
    return [
      this.corner(indices[direction % indices.length][0], hexSize),
      this.corner(indices[direction % indices.length][1], hexSize),
    ]
  }

  indexLoc(index: number, hexSize: number): number[] {
    const edge = this.edge(-2 * index + 2, hexSize)
    const center = this.to_world(hexSize)
    return [
      (((edge[0][0] + edge[1][0]) / 2) * 3 + center[0]) / 4,
      (((edge[0][1] + edge[1][1]) / 2) * 3 + center[1]) / 4,
    ]
  }

  vertices(hexSize: number): number[][] {
    const toReturn: number[][] = []
    for (let i = 0; i < 6; i++) {
      toReturn.push(this.corner(i, hexSize))
    }
    return toReturn
  }

  neighbor(direction: number): CubeHexInterface {
    return this.add(DIRECTION_VECTORS[direction])
  }

  toString(): string {
    return (
      'CubeHex(' +
      this.q.toString() +
      ', ' +
      this.r.toString() +
      ', ' +
      this.s.toString() +
      ')'
    )
  }

  equals(other: CubeHexInterface): boolean {
    return this.q === other.q && this.r === other.r && this.s === other.s
  }

  add(other: CubeHexInterface): CubeHex {
    return new CubeHex(this.q + other.q, this.r + other.r, this.s + other.s)
  }

  static fromAxialRS(r: number, s: number): CubeHex {
    return new CubeHex(-r - s, r, s)
  }

  round(): CubeHex {
    let q = Math.round(this.q)
    let r = Math.round(this.r)
    let s = Math.round(this.s)

    const qDiff = Math.abs(q - this.q)
    const rDiff = Math.abs(r - this.r)
    const sDiff = Math.abs(s - this.s)

    if (qDiff > rDiff && qDiff > sDiff) {
      q = -r - s
    } else if (rDiff > sDiff) {
      r = -q - s
    } else {
      s = -q - r
    }
    return new CubeHex(q, r, s)
  }

  static fromWorld(x: number, y: number, hexSize: number): CubeHex {
    const q = (Math.sqrt(3) * y + x) / (3 * hexSize) + 2 / 3
    const r = (-2 / 3) * (x / hexSize + 0.5)
    const s = -q - r

    return new CubeHex(q, r, s).round()
  }
}

;[
  new CubeHex(+1, 0, -1),
  new CubeHex(+1, -1, 0),
  new CubeHex(0, -1, +1),
  new CubeHex(-1, 0, +1),
  new CubeHex(-1, +1, 0),
  new CubeHex(0, +1, -1),
].forEach((hex) => {
  DIRECTION_VECTORS.push(hex)
})
