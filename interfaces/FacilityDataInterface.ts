import { Zone } from '~/constants/Zone'
import { FacilityType } from '~/constants/FacilityType'

export interface FacilityDataInterface {
  id: number
  name: string
  zone: Zone
  type: FacilityType
  typeName?: string
  region: number
}
