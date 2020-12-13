import { Faction } from '~/constants/Faction'

export enum Loadout {
  UNKNOWN = 0,
  NC_INFILTRATOR = 1,
  // TRIGGERED
  NC_LIGHT_ASSAULT = 3,
  NC_MEDIC = 4,
  NC_ENGINEER = 5,
  NC_HEAVY_ASSAULT = 6,
  NC_MAX = 7,

  TR_INFILTRATOR = 8,
  // Reeeeee
  TR_LIGHT_ASSAULT = 10,
  TR_MEDIC = 11,
  TR_ENGINEER = 12,
  TR_HEAVY_ASSAULT = 13,
  TR_MAX = 14,

  VS_INFILTRATOR = 15,
  // REEEEEEE
  VS_LIGHT_ASSAULT = 17,
  VS_MEDIC = 18,
  VS_ENGINEER = 19,
  VS_HEAVY_ASSAULT = 20,
  VS_MAX = 21,

  NSO_INFILTRATOR = 28,
  NSO_LIGHT_ASSAULT = 29,
  NSO_MEDIC = 30,
  NSO_ENGINEER = 31,
  NSO_HEAVY_ASSAULT = 32,
  NSO_MAX = 45,
}

export const LoadoutFaction = (loadout: Loadout | undefined): Faction => {
  if (!loadout) {
    return Faction.NONE
  }

  switch (loadout) {
    case Loadout.NC_INFILTRATOR:
    case Loadout.NC_LIGHT_ASSAULT:
    case Loadout.NC_MEDIC:
    case Loadout.NC_ENGINEER:
    case Loadout.NC_HEAVY_ASSAULT:
    case Loadout.NC_MAX:
      return Faction.NEW_CONGLOMERATE
    case Loadout.TR_INFILTRATOR:
    case Loadout.TR_LIGHT_ASSAULT:
    case Loadout.TR_MEDIC:
    case Loadout.TR_ENGINEER:
    case Loadout.TR_HEAVY_ASSAULT:
    case Loadout.TR_MAX:
      return Faction.TERRAN_REPUBLIC
    case Loadout.VS_INFILTRATOR:
    case Loadout.VS_LIGHT_ASSAULT:
    case Loadout.VS_MEDIC:
    case Loadout.VS_ENGINEER:
    case Loadout.VS_HEAVY_ASSAULT:
    case Loadout.VS_MAX:
      return Faction.VANU_SOVEREIGNTY
    case Loadout.NSO_INFILTRATOR:
    case Loadout.NSO_LIGHT_ASSAULT:
    case Loadout.NSO_MEDIC:
    case Loadout.NSO_ENGINEER:
    case Loadout.NSO_HEAVY_ASSAULT:
    case Loadout.NSO_MAX:
      return Faction.NS_OPERATIVES
  }
}

export const LoadoutName = (loadout: Loadout | undefined): string => {
  if (!loadout) {
    return 'UNKNOWN'
  }

  switch (loadout) {
    case Loadout.NC_INFILTRATOR:
    case Loadout.TR_INFILTRATOR:
    case Loadout.VS_INFILTRATOR:
    case Loadout.NSO_INFILTRATOR:
      return 'Infiltrator'
    case Loadout.NC_LIGHT_ASSAULT:
    case Loadout.TR_LIGHT_ASSAULT:
    case Loadout.VS_LIGHT_ASSAULT:
    case Loadout.NSO_LIGHT_ASSAULT:
      return 'Light Assault'
    case Loadout.NC_MEDIC:
    case Loadout.TR_MEDIC:
    case Loadout.VS_MEDIC:
    case Loadout.NSO_MEDIC:
      return 'Medic'
    case Loadout.NC_ENGINEER:
    case Loadout.TR_ENGINEER:
    case Loadout.VS_ENGINEER:
    case Loadout.NSO_ENGINEER:
      return 'Engineer'
    case Loadout.NC_HEAVY_ASSAULT:
    case Loadout.TR_HEAVY_ASSAULT:
    case Loadout.VS_HEAVY_ASSAULT:
    case Loadout.NSO_HEAVY_ASSAULT:
      return 'Heavy Assault'
    case Loadout.TR_MAX:
    case Loadout.NC_MAX:
    case Loadout.VS_MAX:
    case Loadout.NSO_MAX:
      return 'MAX'
  }
}
