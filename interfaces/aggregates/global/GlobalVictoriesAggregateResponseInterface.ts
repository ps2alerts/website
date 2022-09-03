import { Zone } from '@/ps2alerts-constants/zone'
import { Bracket } from '@/ps2alerts-constants/bracket'
import { World } from '@/ps2alerts-constants/world'
import { Ps2AlertsEventType } from '~/ps2alerts-constants/ps2AlertsEventType'

export interface GlobalVictoriesAggregateResponseInterface {
  world: World
  zone: Zone
  bracket: Bracket
  ps2AlertsEventType: Ps2AlertsEventType
  date: string
  vs?: number
  nc?: number
  tr?: number
  draws?: number
}
