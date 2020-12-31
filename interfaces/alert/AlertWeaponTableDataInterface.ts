import { InstanceWeaponAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceWeaponAggregateResponseInterface'

export interface AlertWeaponTableDataInterface
  extends InstanceWeaponAggregateResponseInterface {
  hsr: string | number
}
