import { CensusMapRegionInterface } from './CensusMapRegionInterface'

export interface CensusMapRegionResponseInterface {
  map_region_list: Array<CensusMapRegionInterface>
  returned: number
}
