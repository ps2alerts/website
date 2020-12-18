export const Endpoints = {
  AGGREGATES_GLOBAL_CHARACTER: '/aggregates/global/character',
  AGGREGATES_GLOBAL_CHARACTER_SINGLE:
    '/aggregates/global/character/{character}',
  AGGREGATES_GLOBAL_FACILITY: '/aggregates/global/facility',
  AGGREGATES_GLOBAL_FACILITY_SINGLE: '/aggregates/global/facility/{facility}',
  AGGREGATES_GLOBAL_FACTION: '/aggregates/global/faction',
  AGGREGATES_GLOBAL_FACTION_SINGLE: '/aggregates/global/faction/{world}',
  AGGREGATES_GLOBAL_LOADOUT: '/aggregates/global/loadout',
  AGGREGATES_GLOBAL_LOADOUT_SINGLE: '/aggregates/global/loadout/{loadout}',
  AGGREGATES_GLOBAL_OUTFIT: '/aggregates/global/outfit',
  AGGREGATES_GLOBAL_OUTFIT_SINGLE: '/aggregates/global/outfit/{outfit}',
  AGGREGATES_GLOBAL_VEHICLE: '/aggregates/global/vehicle',
  AGGREGATES_GLOBAL_VEHICLE_SINGLE: '/aggregates/global/vehicle/{vehicle}',
  AGGREGATES_GLOBAL_VEHICLE_CHARACTER: '/aggregates/global/vehicle/character',
  AGGREGATES_GLOBAL_VEHICLE_CHARACTER_SINGLE:
    '/aggregates/global/vehicle/character/{character}',
  AGGREGATES_GLOBAL_VEHICLE_CHARACTER_SINGLE_VEHICLE:
    '/aggregates/global/vehicle/character/{character}/{vehicle}',
  AGGREGATES_GLOBAL_VICTORIES: '/aggregates/global/victories',
  AGGREGATES_GLOBAL_WEAPON: '/aggregates/global/weapon',
  AGGREGATES_GLOBAL_WEAPON_SINGLE: '/aggregates/global/weapon/{weapon}',

  AGGREGATES_INSTANCE_CHARACTER: '/aggregates/instance/{instance}/character',
  AGGREGATES_INSTANCE_CHARACTER_SINGLE:
    '/aggregates/instance/{instance}/character/{character}',
  AGGREGATES_INSTANCE_COMBAT_HISTORY:
    '/aggregates/instance/{instance}/combat-history',
  AGGREGATES_INSTANCE_FACILITY: '/aggregates/instance/{instance}/facility',
  AGGREGATES_INSTANCE_FACILITY_SINGLE:
    '/aggregates/instance/{instance}/facility/{facility}',
  AGGREGATES_INSTANCE_FACTION: '/aggregates/instance/{instance}/faction',
  AGGREGATES_INSTANCE_LOADOUT: '/aggregates/instance/{instance}/loadout',
  AGGREGATES_INSTANCE_LOADOUT_SINGLE:
    '/aggregates/instance/{instance}/loadout/{loadout}',
  AGGREGATES_INSTANCE_OUTFIT: '/aggregates/instance/{instance}/outfit',
  AGGREGATES_INSTANCE_OUTFIT_SINGLE:
    '/aggregates/instance/{instance}/outfit/{outfit}',
  AGGREGATES_INSTANCE_POPULATION: '/aggregates/instance/{instance}/population',
  AGGREGATES_INSTANCE_VEHICLE: '/aggregates/instance/{instance}/vehicle',
  AGGREGATES_INSTANCE_VEHICLE_SINGLE:
    '/aggregates/instance/{instance}/vehicle/{vehicle}',
  AGGREGATES_INSTANCE_VEHICLE_CHARACTER:
    '/aggregates/instance/vehicle/character',
  AGGREGATES_INSTANCE_VEHICLE_CHARACTER_SINGLE:
    '/aggregates/instance/vehicle/character/{character}',
  AGGREGATES_INSTANCE_VEHICLE_CHARACTER_SINGLE_VEHICLE:
    '/aggregates/instance/vehicle/character/{character}/{vehicle}',
  AGGREGATES_INSTANCE_WEAPON: '/aggregates/instance/{instance}/weapon',
  AGGREGATES_INSTANCE_WEAPON_SINGLE:
    '/aggregates/instance/{instance}/weapon/{weapon}',

  INSTANCE_FACILITY_CONTROL_ENTRIES: '/instance-entries/{instance}/facility',
  INSTANCE_FACILITY_CONTROL_ENTRIES_FACILITY:
    '/instance-entries/{instance}/facility/{facility}',

  INSTANCE: '/instances/{instance}',
  INSTANCES_ACTIVE: '/instances/active',
  INSTANCES_TERRITORY_CONTROL: '/instances/territory-control',
}

export const CensusEndpoints = {
  VEHICLE_DATA: 's:{serviceId}/get/ps2:v2/vehicle?c:limit=1000',
}
