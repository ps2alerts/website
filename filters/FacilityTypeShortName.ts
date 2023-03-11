import Vue from 'vue'
import { FacilityType } from '@/ps2alerts-constants/facilityType'

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
      case FacilityType.CTF_AMP_STATION:
        return 'ctf-amp'
      case FacilityType.CTF_CONSTRUCTION_OUTPOST:
        return 'ctf-const'
      case FacilityType.CTF_LARGE_OUTPOST:
        return 'ctf-lg-out'
      case FacilityType.CTF_SMALL_OUTPOST:
        return 'ctf-sm-out'
      default:
        return 'unknown'
    }
  }
)

export default facilityTypeShortName
