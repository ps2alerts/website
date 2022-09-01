import { Faction } from '@/ps2alerts-constants/faction'

export const FactionTextClass = (faction: Faction) => {
  return {
    'text-vs': faction === Faction.VANU_SOVEREIGNTY,
    'text-nc': faction === Faction.NEW_CONGLOMERATE,
    'text-tr': faction === Faction.TERRAN_REPUBLIC,
    'text-nso': faction === Faction.NS_OPERATIVES,
  }
}

export const FactionTextClassString = (
  faction: Faction | undefined
): string => {
  if (!faction) {
    return ''
  }

  switch (faction) {
    case Faction.VANU_SOVEREIGNTY:
      return 'text-vs'
    case Faction.NEW_CONGLOMERATE:
      return 'text-nc'
    case Faction.TERRAN_REPUBLIC:
      return 'text-tr'
    case Faction.NS_OPERATIVES:
      return 'text-nso'
  }
}
