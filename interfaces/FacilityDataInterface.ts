import { Zone } from '@/ps2alerts-constants/zone'
import { FacilityType } from '@/ps2alerts-constants/facilityType'

export interface FacilityDataInterface {
  id: number
  name: string
  zone: Zone
  type: FacilityType
  typeName?: string
  region: number
}
