import { MapRegion } from './MapRegion'
import ApiRequest from '~/api-request'
import { CensusEndpoints, Endpoints } from '~/constants/Endpoints'
import { CensusMapRegionResponseInterface } from '~/interfaces/mapping/CensusMapRegionResponseInterface'
import { Zone } from '~/constants/Zone'

export default class MapRegionDataRequest {
  private data: MapRegion[] = []

  public async pull(zone: Zone): Promise<MapRegion[]> {
    let request: Promise<CensusMapRegionResponseInterface>
    switch (zone) {
      case Zone.OSHUR:
        request = new ApiRequest().get<CensusMapRegionResponseInterface>(
          Endpoints.CENSUS_OSHUR_HEX_DATA
        )
        break
      default:
        request = new ApiRequest(
          'https://census.daybreakgames.com'
        ).get<CensusMapRegionResponseInterface>(
          CensusEndpoints.CONTINENT_MAP_DATA.replace(
            '{serviceId}',
            'ps2alertsdotcom'
          ).replace('{zone}', zone.toString())
        )
        break
    }
    await request.then((result) => {
      const regionIdMap: Record<number, MapRegion> = {}
      result.map_region_list.forEach((region) => {
        const regionData: MapRegion = new MapRegion(region, zone)
        this.data.push(regionData)
        regionIdMap[regionData.id] = regionData
      })

      this.data.forEach((region) => {
        region.connectionIds.forEach((id) => {
          region.connections.push(regionIdMap[id])
        })
      })
    })
    return this.data
  }
}
