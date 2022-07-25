import Vue from 'vue'
import { Faction } from '@/ps2alerts-constants/faction'

const factionId = Vue.filter('factionId', (value: string): Faction => {
  switch (value) {
    case 'vs':
    case 'VS':
      return Faction.VANU_SOVEREIGNTY
    case 'nc':
    case 'NC':
      return Faction.NEW_CONGLOMERATE
    case 'tr':
    case 'TR':
      return Faction.TERRAN_REPUBLIC
    case 'nso':
    case 'NSO':
      return Faction.NS_OPERATIVES
    default:
      return Faction.NONE
  }
})

export default factionId
