import { GlobalWeaponAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalWeaponAggregateResponseInterface'

export interface StatisticsWeaponTableDataInterface
  extends GlobalWeaponAggregateResponseInterface {
  uuid: string
  hsr: string | number
  worldName: string
}
