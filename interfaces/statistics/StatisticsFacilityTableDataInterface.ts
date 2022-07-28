import { Zone } from '@/ps2alerts-constants/zone'
import { FacilityDataInterface } from '~/interfaces/FacilityDataInterface'

export interface StatisticsFacilityTableDataInterface {
  uuid: string
  worldName: string
  facility: FacilityDataInterface
  zone: Zone
  zoneName: string
  captures: number
  defences: number
  vsCaps: number
  ncCaps: number
  trCaps: number
}
