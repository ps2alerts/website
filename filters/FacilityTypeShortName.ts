import Vue from 'vue'
import { FacilityType } from '~/constants/FacilityType'

const facilityTypeShortName = Vue.filter(
  'facilityTypeShortName',
  (facilityType: FacilityType) => {
    switch (facilityType) {
      case FacilityType.AMP_STATION:
        return 'amp'
      case FacilityType.BIO_LAB:
        return 'bio'
      case FacilityType.TECH_PLANT:
        return 'tech'
      case FacilityType.LARGE_OUTPOST:
        return 'lg-out'
      case FacilityType.SMALL_OUTPOST:
        return 'sm-out'
      case FacilityType.WARPGATE:
        return 'wg'
      case FacilityType.INTERLINK_FACILITY:
        return 'inter'
      case FacilityType.CONSTRUCTION_OUTPOST:
        return 'const'
      case FacilityType.RELIC_OUTPOST:
        return 'rel'
      case FacilityType.CONTAINMENT_SITE:
        return 'con-site'
      case FacilityType.TRIDENT:
        return 'trid'
      case FacilityType.UNDERWATER:
        return 'seapost'
      default:
        return 'unknown'
    }
  }
)

export default facilityTypeShortName
