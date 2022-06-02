import { InstanceOutfitAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceOutfitAggregateResponseInterface'

export interface AlertOutfitTableDataInterface
  extends InstanceOutfitAggregateResponseInterface {
  kd: string | number
  hsr: string | number
  kpp: string | number
  dpp: string | number
  hspp: string | number
  tkpp: string | number
  suipp: string | number
  durationPlaying?: string
}
