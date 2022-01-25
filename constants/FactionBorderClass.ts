import { Faction } from '@/constants/Faction'

export const FactionBorderClass = (faction: Faction, alt = false) => {
  return {
    'border-vs': faction === Faction.VANU_SOVEREIGNTY,
    'border-nc': faction === Faction.NEW_CONGLOMERATE,
    'border-tr': faction === Faction.TERRAN_REPUBLIC && !alt,
    'border-tr-alt': faction === Faction.TERRAN_REPUBLIC && alt,
    'border-other': faction === Faction.NS_OPERATIVES,
  }
}

export const FactionBorderClassString = (
  faction: Faction | undefined
): string => {
  if (!faction) {
    return ''
  }

  switch (faction) {
    case Faction.VANU_SOVEREIGNTY:
      return 'border-vs'
    case Faction.NEW_CONGLOMERATE:
      return 'border-nc'
    case Faction.TERRAN_REPUBLIC:
      return 'border-tr'
    case Faction.NS_OPERATIVES:
      return 'border-other'
  }
}
