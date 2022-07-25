import Vue from 'vue'
import { World } from '@/ps2alerts-constants/world'

const worldNameFilter = Vue.filter('worldName', (world: World) => {
  switch (world) {
    // PC worlds
    case World.COBALT:
      return 'Cobalt'
    case World.CONNERY:
      return 'Connery'
    case World.EMERALD:
      return 'Emerald'
    case World.JAEGER:
      return 'Jaeger'
    case World.MILLER:
      return 'Miller'
    case World.SOLTECH:
      return 'SolTech'
    // PS4 Worlds
    case World.CERES:
      return 'Ceres'
    case World.GENUDINE:
      return 'Genudine'
    default:
      return 'UNKNOWN!'
  }
})

export default worldNameFilter
