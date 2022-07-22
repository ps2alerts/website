import { Zone } from '@/constants/zone'
import { FacilityType } from '~/constants/facilityType'

export interface FacilityDataInterface {
  id: number
  name: string
  zone: Zone
  type: FacilityType
  typeName?: string
  region: number
}
