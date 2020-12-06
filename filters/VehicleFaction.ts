import { Vehicle } from '@/constants/Vehicle'
import { Faction } from '@/constants/Faction'
import Vue from 'vue'

const vehicleFaction = Vue.filter('vehicleFaction', (vehicle: Vehicle) => {
  switch (vehicle) {
    case Vehicle.MAGRIDER:
    case Vehicle.SCYTHE:
    case Vehicle.SCYTHE_INTERCEPTOR:
      return Faction.VANU_SOVEREIGNTY
    case Vehicle.VANGUARD:
    case Vehicle.REAVER:
    case Vehicle.REAVER_INTERCEPTOR:
      return Faction.NEW_CONGLOMERATE
    case Vehicle.PROWLER:
    case Vehicle.MOSQUITO:
    case Vehicle.MOSQUITO_INTERCEPTOR:
      return Faction.TERRAN_REPUBLIC
    case Vehicle.JAVELIN:
    case Vehicle.JAVELIN_2:
      return Faction.NS_OPERATIVES
    default:
      return Faction.NONE
  }
})

export default vehicleFaction
