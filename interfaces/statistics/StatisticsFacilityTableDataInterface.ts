import { Zone } from '~/constants/Zone'

export interface StatisticsFacilityTableDataInterface {
  uuid: string
  worldName: string
  facilityName: string
  zone: Zone
  zoneName: string
  captures: number
  defences: number
  vsCaps: number
  ncCaps: number
  trCaps: number
}
