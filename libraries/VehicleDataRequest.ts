import ApiRequest from '~/api-request'
import { CensusVehicleResponseInterface } from '~/interfaces/census/CensusVehicleResponseInterface'
import { CensusEndpoints } from '~/constants/Endpoints'
import { VehicleDataInterface } from '~/interfaces/VehicleDataInterface'
import vehicleFaction from '~/filters/VehicleFaction'
import { Faction } from '~/constants/Faction'
import { Vehicle } from '~/constants/Vehicle'

export default class VehicleDataRequest {
  public async pull(): Promise<VehicleDataInterface[]> {
    const data: VehicleDataInterface[] = []

    await new ApiRequest('https://census.daybreakgames.com')
      .get<CensusVehicleResponseInterface>(
        CensusEndpoints.VEHICLE_DATA.replace('{serviceId}', 'ps2alertsdotcom')
      )
      .then((result) => {
        result.vehicle_list.forEach((vehicle) => {
          const vehicleData: VehicleDataInterface = {
            id: parseInt(vehicle.vehicle_id, 10),
            name: vehicle.name.en,
            faction: vehicleFaction(parseInt(vehicle.vehicle_id, 10)),
          }
          data.push(vehicleData)
        })

        // Data injections cos DBG are crap
        data.push({
          id: Vehicle.CHIMERA,
          name: 'Chimera',
          faction: Faction.NS_OPERATIVES,
        })
        data.push({
          id: Vehicle.DELIVERER_PROTOTYPE_2,
          name: 'Delivery Prototype',
          faction: Faction.NONE,
        })
        data.push({
          id: Vehicle.LODESTAR_PROTOTYPE_2,
          name: 'Lodestar Prototype',
          faction: Faction.NONE,
        })
        data.push({
          id: Vehicle.WASP_PROTOTYPE_2,
          name: 'Wasp Prototype',
          faction: Faction.NONE,
        })
      })
    return data
  }
}
