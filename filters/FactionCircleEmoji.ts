import Vue from 'vue'
import { Faction } from '@/ps2alerts-constants/faction'

const factionCircleEmoji = Vue.filter(
  'factionCircleEmoji',
  (value: Faction) => {
    switch (value) {
      case Faction.VANU_SOVEREIGNTY:
        return '🟣'
      case Faction.TERRAN_REPUBLIC:
        return '🔴'
      case Faction.NEW_CONGLOMERATE:
        return '🔵'
      default:
        return '⚪'
    }
  }
)

export default factionCircleEmoji
