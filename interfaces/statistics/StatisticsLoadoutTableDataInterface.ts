import { GlobalLoadoutAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalLoadoutAggregateResponseInterface'

export interface StatisticsLoadoutTableDataInterface
  extends GlobalLoadoutAggregateResponseInterface {
  uuid: string
  kd: string | number
  hsr: string | number
  worldName: string
}
