import { Bracket } from '~/constants/Bracket'
import { CommonApiParamsInterface } from '~/interfaces/CommonApiParmsInterface'

export interface GlobalAggregateParamsInterface
  extends CommonApiParamsInterface {
  bracket?: Bracket
  dateFrom?: string
  dateTo?: string
}
