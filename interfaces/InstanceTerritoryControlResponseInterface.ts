import { World } from '~/constants/world'
import { Zone } from '@/constants/zone'
import { Ps2alertsEventState } from '~/constants/ps2alertsEventState'
import { TerritoryResultInterface } from '~/interfaces/InstanceTerritoryResultInterface'
import { Bracket } from '~/constants/bracket'
import { PS2AlertsInstanceFeaturesInterface } from '~/interfaces/PS2AlertsInstanceFeaturesInterface'

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
}
