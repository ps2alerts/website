import {Faction} from "@/constants/Faction";

export const FactionName = function(value: Faction | null) {
  switch (value) {
    case Faction.VANU_SOVEREIGNTY:
      return 'Vanu Sovereignty'
    case Faction.NEW_CONGLOMERATE:
      return 'New Conglomerate'
    case Faction.TERRAN_REPUBLIC:
      return 'Terran Republic'
    case Faction.NS_OPERATIVES:
      return 'NS Operatives'
    default:
      return 'UNKNOWN!'
  }
}
