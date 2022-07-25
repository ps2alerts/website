import { Bracket } from '@/ps2alerts-constants/bracket'
import { CommonApiParamsInterface } from '~/interfaces/CommonApiParmsInterface'

export interface GlobalAggregateParamsInterface
  extends CommonApiParamsInterface {
  bracket?: Bracket
  dateFrom?: string
  dateTo?: string
}
