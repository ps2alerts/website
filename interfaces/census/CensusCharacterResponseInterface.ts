/* eslint-disable camelcase */
import { CensusCharacterResponseInterfaceItem } from '~/interfaces/census/CensusCharacterResponseInterfaceItem'

export interface CensusCharacterResponseInterface {
  character_list: CensusCharacterResponseInterfaceItem[]
  returned: number
}
