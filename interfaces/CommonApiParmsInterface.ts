import { World } from '~/constants/World'
import { Zone } from '~/constants/Zone'
import { Bracket } from '~/constants/Bracket'

export interface CommonApiParamsInterface {
  world?: World
  zone?: Zone
  sortBy?: string
  order?: string
  pageSize?: number
  bracket?: Bracket
}
