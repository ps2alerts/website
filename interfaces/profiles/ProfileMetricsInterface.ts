import { PS2AlertsFactionKillDataInterface } from '~/ps2alerts-constants/interfaces/PS2AlertsFactionKillDataInterface'
import { InstanceCharacterInterface } from '~/ps2alerts-constants/interfaces/api-responses/InstanceCharacterInterface'
import { CombatMetricsInterface } from '~/ps2alerts-constants/interfaces/CombatMetricsInterface'

interface ProfileCommonMetricsInterface extends CombatMetricsInterface {
  kd: number // Calculated
  hsr: number // Calculated
  factionKills: PS2AlertsFactionKillDataInterface
}

export interface ProfileMetricsInterface {
  totals: ProfileCommonMetricsInterface
  averages: ProfileCommonMetricsInterface
  lastXAlertsPerformance: ProfileCommonMetricsInterface
  alerts: InstanceCharacterInterface[]
}
