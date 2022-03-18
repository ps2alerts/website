export interface CubeHexInterface {
  q: number
  r: number
  s: number
  edge(direction: number, hex_size: number): number[][]
  neighbor(direction: number): CubeHexInterface
  toString(): string
  equals(other: CubeHexInterface): boolean
}
