import { InstanceFacilityControlEntriesResponseInterface } from '~/interfaces/instance-entries/InstanceFacilityControlEntriesResponseInterface'
import { FacilityDataInterface } from '~/interfaces/FacilityDataInterface'

export interface InstanceMapCaptureHistoryInterface
  extends InstanceFacilityControlEntriesResponseInterface {
  facilityData: FacilityDataInterface
  factionWinner: string // NC etc
  factionLooser: string // TR etc
}
