import { World } from '@/ps2alerts-constants/world'
import { Zone } from '@/ps2alerts-constants/zone'
import { Bracket } from '@/ps2alerts-constants/bracket'

export interface CommonApiParamsInterface {
  world?: World
  zone?: Zone
  sortBy?: string
  order?: string
  pageSize?: number
  bracket?: Bracket
}
