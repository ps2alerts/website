import ApiRequest from '~/api-request';
import { MapStateInterface, LithaFalconMapStateResponseInterface } from '~/interfaces/mapping/MapStateInterface'
import { lithafalconCensusUrl, lithafalconEndpoints } from '~/ps2alerts-constants/lithafalconEndpoints';
import { World } from '~/ps2alerts-constants/world';
import { Zone } from '~/ps2alerts-constants/zone';
import MapState from './MapState';

export default class MapStateDataRequest {
    private data: MapStateInterface[] = [];

    public async pull(world: World, zone: Zone): Promise<MapStateInterface[]> {
        const request = new ApiRequest(lithafalconCensusUrl).get<LithaFalconMapStateResponseInterface>(
            lithafalconEndpoints.mapStateByWorldAndZone.replace(
                '{world_id}',
                world.valueOf().toString()
            ).replace(
                '{zone_id}',
                zone.valueOf().toString()
            )
        )

        await request.then((result) => {
            result.map_state_list.forEach((entry) => {
                this.data.push(new MapState(entry))
            })
        })

        return this.data
    }
}