import { Faction } from '@/constants/Faction'

export const FactionBgClass = (faction: Faction) => {
  return {
    'bg-vs': faction === Faction.VANU_SOVEREIGNTY,
    'bg-nc': faction === Faction.NEW_CONGLOMERATE,
    'bg-tr': faction === Faction.TERRAN_REPUBLIC,
    'bg-nso': faction === Faction.NS_OPERATIVES,
  }
}
