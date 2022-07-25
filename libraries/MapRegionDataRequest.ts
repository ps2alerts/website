import { MapRegion } from './MapRegion'
import ApiRequest from '~/api-request'
import { Endpoints } from '@/constants/Endpoints'
import { CensusMapRegionResponseInterface } from '~/interfaces/mapping/CensusMapRegionResponseInterface'
import { Zone } from '@/ps2alerts-constants/zone'

export default class MapRegionDataRequest {
  private data: MapRegion[] = []

  public async pull(zone: Zone, version: string = '1.0'): Promise<MapRegion[]> {
    const request = new ApiRequest().get<CensusMapRegionResponseInterface>(
      Endpoints.CENSUS_CONTINENT_HEX_DATA.replace(
        '{zone}',
        zone.valueOf().toString()
      ).replace('{version}', version)
    )

    await request.then((result) => {
      const regionIdMap: Record<number, MapRegion> = {}
      result.map_region_list.forEach((region) => {
        const regionData: MapRegion = new MapRegion(region, zone)
        this.data.push(regionData)
        regionIdMap[regionData.id] = regionData
      })

      this.data.forEach((region) => {
        region.connectionIds.forEach((id) => {
          // Don't add duplicates
          if (
            region.connections.find((r) => {
              return r.id === id
            }) !== undefined
          ) {
            return
          }
          region.connections.push(regionIdMap[id])
          regionIdMap[id].connections.push(region)
        })
      })
    })
    return this.data
  }
}
