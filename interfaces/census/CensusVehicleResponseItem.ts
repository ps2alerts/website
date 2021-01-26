/* eslint-disable camelcase */
export interface CensusVehicleResponseItem {
  vehicle_id: string
  name: {
    de: string
    en: string
    es: string
    fr: string
    it: string
    tr: string
  }
  description: {
    de: string
    en: string
    es: string
    fr: string
    it: string
    tr: string
  }
  type_id: string
  type_name: string
  cost: string
  cost_resource_id: string
  image_set_id: string
  image_id: string
  image_path: string
}
