import { GlobalOutfitAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalOutfitAggregateResponseInterface'

export interface StatisticsOutfitTableDataInterface
  extends GlobalOutfitAggregateResponseInterface {
  uuid: string
  kd: string | number
  hsr: string | number
  worldName: string
}
