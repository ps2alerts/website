import { World } from '@/ps2alerts-constants/world'
import { Zone } from '@/ps2alerts-constants/zone'
import { Bracket } from '@/ps2alerts-constants/bracket'
import { Ps2AlertsEventType } from '~/ps2alerts-constants/ps2AlertsEventType'

export interface CommonApiParamsInterface {
  world?: World
  zone?: Zone
  sortBy?: string
  order?: string
  pageSize?: number
  bracket?: Bracket
  ps2AlertsEventType?: Ps2AlertsEventType
  [key: string]: any
}
