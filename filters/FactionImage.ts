import Vue from 'vue'
import { Faction } from '@/ps2alerts-constants/faction'

const factionImage = Vue.filter('factionImage', (value: Faction): string => {
  return `/img/factions/${value}.png`
})

export default factionImage