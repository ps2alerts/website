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
  AGGREGATES_INSTANCE_POPULATION_AVERAGES:
    '/aggregates/instance/{instance}/population/averages',
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

  CENSUS_OSHUR_DATA: '/census/oshur',
  CENSUS_OSHUR_HEX_DATA: '/census/oshur-hex',

  INSTANCE_FACILITY_CONTROL_ENTRIES:
    '/instance-entries/{instance}/facility?sortBy=timestamp&order=desc',
  INSTANCE_FACILITY_CONTROL_ENTRIES_FACILITY:
    '/instance-entries/{instance}/facility/{facility}',

  INSTANCE: '/instances/{instance}',
  INSTANCES_ACTIVE: '/instances/active',
  INSTANCES_TERRITORY_CONTROL: '/instances/territory-control',
}

export const CensusEndpoints = {
  CHARACTER_NAME_SEARCH:
    'https://census.daybreakgames.com/s:{serviceId}/get/ps2:v2/character?name.first_lower={characterName}',
  CONTINENT_MAP_DATA:
    "https://census.daybreakgames.com/s:{serviceId}/get/ps2:v2/map_region?zone_id={zone}&c:show=map_region_id,facility_id,facility_name,facility_type_id,location_x,location_z&c:limit=10000&c:join=map_hex^on:map_region_id^to:map_region_id^list:1^show:x'y^inject_at:map_hexes,facility_link^on:facility_id^to:facility_id_a^list:1^show:facility_id_b^inject_at:facility_links(map_region^on:facility_id_b^to:facility_id^show:map_region_id^inject_at:map_region)",
  FACILITY_DATA:
    'https://census.daybreakgames.com/s:{serviceId}/get/ps2:v2/map_region?zone_id={zone}&c:limit=1000',
  VEHICLE_DATA:
    'https://census.daybreakgames.com/s:{serviceId}/get/ps2:v2/vehicle?c:limit=1000',
}
