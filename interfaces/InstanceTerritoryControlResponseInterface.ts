import { World } from '~/constants/World'
import { Zone } from '~/constants/Zone'
import { Ps2alertsEventState } from '~/constants/Ps2alertsEventState'
import { TerritoryResultInterface } from '~/interfaces/InstanceTerritoryResultInterface'
import { Bracket } from '~/constants/Bracket'

export interface InstanceTerritoryControlResponseInterface {
  instanceId: string
  censusInstanceId: string
  world: World
  zone: Zone
  timeStarted: string
  censusMetagameEventType: number
  duration: number
  state: Ps2alertsEventState
  result: TerritoryResultInterface
  bracket: Bracket
}
