import { World } from '@/ps2alerts-constants/world'
import { Zone } from '@/ps2alerts-constants/zone'
import { Ps2AlertsEventState } from '@/ps2alerts-constants/ps2AlertsEventState'
import { TerritoryResultInterface } from '~/interfaces/InstanceTerritoryResultInterface'
import { Bracket } from '@/ps2alerts-constants/bracket'
import { PS2AlertsInstanceFeaturesInterface } from '~/interfaces/PS2AlertsInstanceFeaturesInterface'
import { Ps2AlertsEventType } from '~/ps2alerts-constants/ps2AlertsEventType'

export interface InstanceTerritoryControlResponseInterface {
  instanceId: string
  censusInstanceId: string
  world: World
  zone: Zone
  timeStarted: string
  timeEnded?: string | null
  censusMetagameEventType: number
  duration: number
  state: Ps2AlertsEventState
  result: TerritoryResultInterface
  bracket: Bracket
  features?: PS2AlertsInstanceFeaturesInterface
  mapVersion?: string
  latticeVersion?: string
  ps2AlertsEventType?: Ps2AlertsEventType
}
