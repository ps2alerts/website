import { InstanceLoadoutResponseInterface } from '~/interfaces/aggregates/instance/InstanceLoadoutResponseInterface'

export interface AlertLoadoutTableDataInterface
  extends InstanceLoadoutResponseInterface {
  loadoutName: string
  kd: string | number
  hsr: string | number
}
