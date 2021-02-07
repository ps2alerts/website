export interface FactionVsFactionDataInterface {
  vs?: {
    nc?: number
    tr?: number
    nso?: number
  }
  nc?: {
    vs?: number
    tr?: number
    nso?: number
  }
  tr?: {
    vs?: number
    nc?: number
    nso?: number
  }
  nso?: {
    vs?: number
    nc?: number
    tr?: number
  }
}
