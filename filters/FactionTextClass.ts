import Vue from 'vue'
import { Faction } from '~/ps2alerts-constants/faction'

const factionTextClass = Vue.filter('factionTextClass', (value: Faction) => {
  switch (value) {
    case Faction.VANU_SOVEREIGNTY:
      return 'text-vs'
    case Faction.NEW_CONGLOMERATE:
      return 'text-nc'
    case Faction.TERRAN_REPUBLIC:
      return 'text-tr'
    case Faction.NS_OPERATIVES:
      return 'text-nso'
    default:
      return 'text-gray-600'
  }
})

export default factionTextClass
