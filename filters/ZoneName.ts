import Vue from 'vue'
import { Zone } from '@/ps2alerts-constants/zone'

const zoneNameFilter = Vue.filter('zoneName', (value: Zone) => {
  switch (value) {
    case Zone.INDAR:
      return 'Indar'
    case Zone.HOSSIN:
      return 'Hossin'
    case Zone.AMERISH:
      return 'Amerish'
    case Zone.ESAMIR:
      return 'Esamir'
    case Zone.OSHUR:
      return 'Oshur'
    default:
      return 'UNKNOWN!'
  }
})

export default zoneNameFilter
