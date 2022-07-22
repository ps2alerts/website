import { World } from '~/constants/world'
import { Zone } from '@/constants/zone'
import { Bracket } from '~/constants/bracket'

export interface CommonApiParamsInterface {
  world?: World
  zone?: Zone
  sortBy?: string
  order?: string
  pageSize?: number
  bracket?: Bracket
}
