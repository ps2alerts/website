import Vue from 'vue'
import { World } from '~/ps2alerts-constants/world'
import worldNameFilter from '~/filters/WorldName'

const worldImage = Vue.filter('worldImage', (value: World): string => {
  const worldName = worldNameFilter(value)
  return `/img/worlds/${worldName}.png`
})

export default worldImage
