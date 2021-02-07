import { FacilityDataInterface } from '~/interfaces/FacilityDataInterface'

interface FacilityControlAggregateFactionInterface {
  captures?: number
  defences?: number
  lostTo?: { vs?: number; nc?: number; tr?: number }
  takenFrom?: { vs?: number; nc?: number; tr?: number }
}

export interface InstanceFacilityControlAggregateResponseInterface {
  instance: string
  facility: FacilityDataInterface
  vs?: FacilityControlAggregateFactionInterface
  nc?: FacilityControlAggregateFactionInterface
  tr?: FacilityControlAggregateFactionInterface
}
