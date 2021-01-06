import { Bracket } from '~/constants/Bracket'
import { CommonApiParamsInterface } from '~/interfaces/CommonApiParmsInterface'

export interface GlobalAggregateParamsInterface
  extends CommonApiParamsInterface {
  bracket?: Bracket
  timeStartedFrom?: string
  timeStartedTo?: string
}
