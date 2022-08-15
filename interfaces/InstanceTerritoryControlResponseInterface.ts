import { World } from '@/ps2alerts-constants/world'
import { Zone } from '@/ps2alerts-constants/zone'
import { Ps2alertsEventState } from '@/ps2alerts-constants/ps2alertsEventState'
import { TerritoryResultInterface } from '~/interfaces/InstanceTerritoryResultInterface'
import { Bracket } from '@/ps2alerts-constants/bracket'
import { PS2AlertsInstanceFeaturesInterface } from '~/interfaces/PS2AlertsInstanceFeaturesInterface'
import { Ps2alertsEventType } from '~/ps2alerts-constants/ps2alertsEventType'

export interface InstanceTerritoryControlResponseInterface {
  instanceId: string
  censusInstanceId: string
  world: World
  zone: Zone
  timeStarted: string
  timeEnded?: string | null
  censusMetagameEventType: number
  duration: number
  state: Ps2alertsEventState
  result: TerritoryResultInterface
  bracket: Bracket
  features?: PS2AlertsInstanceFeaturesInterface
  mapVersion?: string
  ps2alertsEventType?: Ps2alertsEventType
}
