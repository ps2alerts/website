import { InstanceCharacterAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceCharacterAggregateResponseInterface'

export interface AlertCharacterTableDataInterface
  extends InstanceCharacterAggregateResponseInterface {
  kd: string | number
  hsr: string | number
  br: string
}
