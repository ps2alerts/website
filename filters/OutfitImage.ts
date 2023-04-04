import Vue from 'vue'
import { Endpoints } from '~/constants/Endpoints'

const outfitImage = Vue.filter('outfitImage', (outfitId: string): string => {
  return Endpoints.OUTFIT_TRACKER_OUTFIT_LOGO.replace('{outfitId}', outfitId)
})

export default outfitImage
