import { World } from '~/constants/World'
import { Zone } from '~/constants/Zone'
import { Ps2alertsEventState } from '~/constants/Ps2alertsEventState'
import { TerritoryResultInterface } from '~/interfaces/InstanceTerritoryResultInterface'
import { Bracket } from '~/constants/Bracket'
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
  features: PS2AlertsInstanceFeaturesInterface
}
