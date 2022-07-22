import Vue from 'vue'
import { Faction } from '@/constants/faction'

const factionName = Vue.filter('factionName', (value: Faction) => {
  switch (value) {
    case Faction.NONE:
      return 'None / High Pops'
    case Faction.VANU_SOVEREIGNTY:
      return 'Vanu Sovereignty'
    case Faction.NEW_CONGLOMERATE:
      return 'New Conglomerate'
    case Faction.TERRAN_REPUBLIC:
      return 'Terran Republic'
    case Faction.NS_OPERATIVES:
      return 'NS Operatives'
    default:
      return 'UNKNOWN!'
  }
})

export default factionName
