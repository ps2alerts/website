import { Faction } from '@/constants/Faction'

export const FactionBgClass = (faction: Faction) => {
  return {
    'bg-vs': faction === Faction.VANU_SOVEREIGNTY,
    'bg-nc': faction === Faction.NEW_CONGLOMERATE,
    'bg-tr': faction === Faction.TERRAN_REPUBLIC,
    'bg-nso': faction === Faction.NS_OPERATIVES,
  }
}

export const FactionBgClassString = (faction: Faction | undefined): string => {
  if (!faction) {
    return ''
  }

  switch (faction) {
    case Faction.VANU_SOVEREIGNTY:
      return 'bg-vs'
    case Faction.NEW_CONGLOMERATE:
      return 'bg-nc'
    case Faction.TERRAN_REPUBLIC:
      return 'bg-tr'
    case Faction.NS_OPERATIVES:
      return 'bg-nso'
  }
}
