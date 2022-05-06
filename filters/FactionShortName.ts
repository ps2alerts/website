import Vue from 'vue'
import { Faction } from '~/constants/Faction'

const factionShortName = Vue.filter(
  'factionShortName',
  (value: Faction, ns: boolean = false) => {
    switch (value) {
      case Faction.NONE:
        return ns ? 'NS' : 'N/A'
      case Faction.VANU_SOVEREIGNTY:
        return 'VS'
      case Faction.NEW_CONGLOMERATE:
        return 'NC'
      case Faction.TERRAN_REPUBLIC:
        return 'TR'
      case Faction.NS_OPERATIVES:
        return 'NSO'
      default:
        return 'UNKNOWN!'
    }
  }
)

export default factionShortName
