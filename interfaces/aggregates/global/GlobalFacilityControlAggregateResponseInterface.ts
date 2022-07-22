import { World } from '~/constants/world'
import { Bracket } from '~/constants/bracket'
import { Zone } from '@/constants/zone'
import { FacilityDataInterface } from '~/interfaces/FacilityDataInterface'

interface FacilityControlVersusInterface {
  vs?: number
  nc?: number
  tr?: number
}
export interface FacilityControlAggregateMetricsInterface {
  captures?: number
  defences?: number
  takenFrom?: FacilityControlVersusInterface
  lostTo?: FacilityControlVersusInterface
}
export interface GlobalFacilityControlAggregateResponseInterface {
  world: World
  zone: Zone
  bracket: Bracket
  facility: FacilityDataInterface
  vs: FacilityControlAggregateMetricsInterface
  nc: FacilityControlAggregateMetricsInterface
  tr: FacilityControlAggregateMetricsInterface
  totals: FacilityControlAggregateMetricsInterface
}
