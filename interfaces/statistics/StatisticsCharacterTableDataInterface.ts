import { GlobalCharacterAggregateResponseInterface } from '~/interfaces/aggregates/global/GlobalCharacterAggregateResponseInterface'

export interface StatisticsCharacterTableDataInterface
  extends GlobalCharacterAggregateResponseInterface {
  uuid: string
  kd: string | number
  hsr: string | number
  br: number
  worldName: string
}
