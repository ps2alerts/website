import { MapRegion } from '~/libraries/MapRegion'

export interface MapDrawingInterface {
  [key: number]: MapRegion
}

const WORLD_SIZE = 8192

function lerp(
  x: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number
): number {
  return y0 * (1 - (x - x0) / (x1 - x0)) + y1 * ((x - x0) / (x1 - x0))
}

export class LatLng {
  lat: number
  lng: number
  constructor(lat: number, lng: number) {
    this.lat = lat
    this.lng = lng
  }

  asArray(): number[] {
    return [this.lat, this.lng]
  }
}

export class Point {
  x: number
  z: number
  constructor(x: number, z: number) {
    this.x = x
    this.z = z
  }

  asArray(): number[] {
    return [this.x, this.z]
  }
}

export function worldToMap(worldCoords: number[]): LatLng {
  return new LatLng(
    lerp(worldCoords[0], -WORLD_SIZE / 2, WORLD_SIZE / 2, -256, 0),
    lerp(worldCoords[1], -WORLD_SIZE / 2, WORLD_SIZE / 2, 0, 256)
  )
}

export function mapToWorld(worldCoords: number[]): Point {
  return new Point(
    lerp(worldCoords[0], -256, 0, -WORLD_SIZE / 2, WORLD_SIZE / 2),
    lerp(worldCoords[1], 0, 256, -WORLD_SIZE / 2, WORLD_SIZE / 2)
  )
}
