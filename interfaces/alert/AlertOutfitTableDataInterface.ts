import { InstanceOutfitAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceOutfitAggregateResponseInterface'

export interface AlertOutfitTableDataInterface
  extends InstanceOutfitAggregateResponseInterface {
  kd: string | number
  hsr: string | number
  participants: number
}
