// Here's a full list: https://discord.com/channels/251073753759481856/451032574538547201/935355006071218236
// Thanks Cooltrain!

export enum Vehicle {
  FLASH = 1,
  SUNDERER = 2,
  LIGHTNING = 3,
  MAGRIDER = 4,
  VANGUARD = 5,
  PROWLER = 6,
  SCYTHE = 7,
  REAVER = 8,
  MOSQUITO = 9,
  LIBERATOR = 10,
  GALAXY = 11,
  HARASSER = 12,
  DROP_POD = 13,
  VALKYRIE = 14,
  ANT = 15,
  XIPHOS_AP_PHALANX_TURRET = 100,
  MANA_AP_TURRET = 101,
  MANA_AV_TURRET = 102,
  SPITFIRE_TURRET = 103, // Used
  SPITFIRE_AUTO_TURRET = 104, // Not used
  SPITFIRE_AA_TURRET = 105, // Not used
  ASPIS_AA_PHALANX_TURRET = 150, // Base AA Turret
  SPEAR_AV_PHALANX_TURRET = 151, // Base AV Turret
  SPEAR_AV_PHALANX_TOWER = 160, // Player Base AV Turret
  ASPIS_AA_PHALANX_TOWER = 161, // Player Base AA Turret
  XIPHOS_AP_TOWER = 162, // Player Base AI Turret
  GLAIVE_IPC = 163, // Player Base Artillery
  FLASH_2 = 1001, // Unused, but has entries in alert data??
  SUNDERER_2 = 1002, // Unused, but has entries in alert data??
  MAGRIDER_2 = 1004, // Unused, but has entries in alert data??
  VANGUARD_2 = 1005, // Unused, but has entries in alert data??
  SCYTHE_2 = 1007, // Unused, but has entries in alert data??
  REAVER_2 = 1008, // Unused, but has entries in alert data??
  MOSQUITO_2 = 1009, // Unused, but has entries in alert data??
  LIBERATOR_2 = 1010, // Unused, but has entries in alert data??
  GALAXY_2 = 1011, // Unused, but has entries in alert data??
  PHOENIX_MISSILE = 1012,
  RECON_DRONE = 1013, // Never implemented
  VANGUARD_3 = 1105, // Wut
  OBSERVER_CAMERA = 1337,
  AUTO_TURRET = 2003, // Never implemented
  SPEAR_AV_PHALANX_TURRET_2 = 2006, // Player Base AV turret (not tower)
  COLOSSUS = 2007,
  DROP_POD_2 = 2008, // Drop Pod Mrk 2? o.O
  XIPHOS_AP_TURRET = 2009, // Wat?
  FLASH_XS_1 = 2010, // Outfit Merit Flash
  FORWARD_STATION = 2011, // Not used also... o.O
  BASTION = 2019, // API says it's a Light Aircraft... LUL
  FLAIL = 2021, // Flail player base
  JAVELIN = 2013, // Not used
  JAVELIN_2 = 2033, // Currently used
  PUMPKIN_PATCH = 2036, // Pumpkins are vehicles apparently
  DELIVERER_PROTOTYPE = 2039, // Spawn ANT, USED
  WASP_PROTOTYPE = 2040, // Cortium Valkyrie, USED
  MOSQUITO_INTERCEPTOR = 2122, // Bastion Mosquito
  REAVER_INTERCEPTOR = 2123, // Bastion Reaver
  SCYTHE_INTERCEPTOR = 2124, // Bastion Scythe
  JAVELIN_3 = 2125, // Again... again? Think it was a story related thing
  SPITFIRE_AUTO_TURRET_2 = 2128, // Duplicate or reworked version?
  DERVISH = 2136,
  CHIMERA = 2137,
  DELIVERER_PROTOTYPE_2 = 2139, // Spawn ANT, UNUSED
  LODESTAR_PROTOTYPE_2 = 2140, // Spawn Galaxy, UNUSED - NOT IN API
  WASP_PROTOTYPE_2 = 2141, // Currently used (Cortium Valkyrie)
  EXODUS_PPC = 2143, // Big Pew Pew on the Oshur carriers
}

// Allowed vehicles to show up in the matrix (both alert and on the stats page)
export const allowedVehicleMatrixArray = [
  Vehicle.FLASH,
  Vehicle.SUNDERER,
  Vehicle.LIGHTNING,
  Vehicle.MAGRIDER,
  Vehicle.VANGUARD,
  Vehicle.PROWLER,
  Vehicle.SCYTHE,
  Vehicle.REAVER,
  Vehicle.MOSQUITO,
  Vehicle.LIBERATOR,
  Vehicle.GALAXY,
  Vehicle.VALKYRIE,
  Vehicle.ANT,
  Vehicle.JAVELIN_2,
  Vehicle.COLOSSUS,
  Vehicle.DERVISH,
  Vehicle.CHIMERA,
]

// Allowed vehicle sto show up in the vehicles totals in the statistics page (all vehicles per alert are allowed as they're filtered by the context of that alert anyway)
export const allowedStatisticsVehiclesArray = [
  Vehicle.FLASH,
  Vehicle.SUNDERER,
  Vehicle.LIGHTNING,
  Vehicle.MAGRIDER,
  Vehicle.VANGUARD,
  Vehicle.PROWLER,
  Vehicle.SCYTHE,
  Vehicle.REAVER,
  Vehicle.MOSQUITO,
  Vehicle.LIBERATOR,
  Vehicle.GALAXY,
  Vehicle.VALKYRIE,
  Vehicle.ANT,
  Vehicle.COLOSSUS,
  Vehicle.JAVELIN_2,
  Vehicle.DROP_POD,
  Vehicle.XIPHOS_AP_PHALANX_TURRET,
  Vehicle.MANA_AP_TURRET,
  Vehicle.MANA_AV_TURRET,
  Vehicle.SPITFIRE_TURRET,
  Vehicle.ASPIS_AA_PHALANX_TURRET,
  Vehicle.SPEAR_AV_PHALANX_TURRET,
  Vehicle.SPEAR_AV_PHALANX_TOWER,
  Vehicle.ASPIS_AA_PHALANX_TOWER,
  Vehicle.XIPHOS_AP_TOWER,
  Vehicle.GLAIVE_IPC,
  Vehicle.PHOENIX_MISSILE,
  Vehicle.SPEAR_AV_PHALANX_TURRET_2,
  Vehicle.FLASH_XS_1,
  Vehicle.BASTION,
  Vehicle.FLAIL,
  Vehicle.DELIVERER_PROTOTYPE,
  Vehicle.WASP_PROTOTYPE,
  Vehicle.LODESTAR_PROTOTYPE_2,
  Vehicle.MOSQUITO_INTERCEPTOR,
  Vehicle.SCYTHE_INTERCEPTOR,
  Vehicle.DERVISH,
  Vehicle.CHIMERA,
]
