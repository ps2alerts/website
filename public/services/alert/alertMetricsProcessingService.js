app.service('AlertMetricsProcessingService', function(
    $filter,
    ConfigDataService,
    MetricsProcessingService
) {
    var alertFactory = {};
    var factory = {};

    factory.init = function(alertFactoryData) {
        alertFactory = alertFactoryData;
    };

    factory.initPlayers = function() {
        return new Promise(function(resolve) {
            angular.forEach(alertFactory.alert.players.data, function(player) {
                factory.addNewPlayer(player).then();
            });
            console.log('Initialized Players');
            resolve();
        });
    };

    factory.initOutfits = function() {
        return new Promise(function(resolve) {
            angular.forEach(alertFactory.alert.outfits.data, function(outfit) {
                factory.addNewOutfit(outfit).then();
            });
            console.log('Initialized Outfits');
            resolve();
        });
    };

    factory.initWeapons = function() {
        return new Promise(function(resolve) {
            angular.forEach(alertFactory.alert.weapons.data, function(weapon) {
                factory.addNewWeapon(weapon).then();
            });
            console.log('Initialized Weapons');
            resolve();
        });
    };

    factory.initVehicles = function() {
        return new Promise(function(resolve) {
            angular.forEach(alertFactory.alert.vehicles.data, function(vehicle) {
                factory.addNewVehicle(vehicle).then();
            });
            console.log('Initialized Vehicles');
            resolve();
        });
    };

    factory.initMap = function() {
        return new Promise(function(resolve) {
            angular.forEach(alertFactory.alert.maps.data, function(capture) {
                factory.addNewCapture(capture).then();
            });
            console.log('Initial Map Captures Processed');
            resolve();
        });
    };

    // Function to add new players to various areas, grabbing new data from Census
    // or our API should we need to
    factory.addNewPlayer = function(player) {
        return new Promise(function(resolve) {
            var formatted = {
                id:        player.player.id,
                name:      player.player.name,
                faction:   player.player.faction,
                kills:     player.metrics.kills,
                deaths:    player.metrics.deaths,
                teamkills: player.metrics.teamkills,
                suicides:  player.metrics.suicides,
                headshots: player.metrics.headshots
            };

            // Calculate -3, -2, -1 etc for players without outfits
            if (player.player.outfitID == 0) {
                player.player.outfitID = MetricsProcessingService.getNoOutfitID(player.player.faction);
            }

            alertFactory.getOutfit(player.player.outfitID).then(function(outfit) {
                if (outfit) {
                    formatted.outfit    = outfit.name;
                    formatted.outfitTag = outfit.tag;
                } else {
                    console.log('Missing outfit ID "' + player.player.outfitID + '" for player: ' + formatted.id);
                    console.log(player);

                    formatted.outfit    = 'UNKNOWN',
                    formatted.outfitTag = null;
                }

                // Set faction abrivation
                formatted.factionAbv = ConfigDataService.convertFactionIntToName(formatted.faction);

                // Attach players to outfits. All players should have outfit IDs,
                // even -1, -2, -3 to denote different faction no outfits
                if (outfit) {
                    // Check if the outfit has been correctly initialized
                    // Store a reference that this player is part of the outfit
                    outfit.players.push(formatted.id);
                    outfit.participants = outfit.players.length;

                    // Nullify participants if less than 6 people so that K/D ratios are more accurate
                    if (outfit.participants < 6 && alertFactory.alert.timeBracket === 'Prime Time') {
                        outfit.kd = 0;
                    } else {
                        outfit.kd = MetricsProcessingService.calcKD(outfit.kills, outfit.deaths);
                        outfit.killsPerParticipant = (outfit.kills / outfit.participants).toFixed(2);
                        outfit.deathsPerParticipant = (outfit.deaths / outfit.participants).toFixed(2);
                    }
                }

                formatted.kd = MetricsProcessingService.calcKD(formatted.kills, formatted.deaths); // Parse KD
                formatted.hsr = MetricsProcessingService.calcHSR(formatted.headshots, formatted.kills);
                formatted.kpm = MetricsProcessingService.getKpm(formatted.kills, alertFactory.alert.duration);
                formatted.dpm = MetricsProcessingService.getKpm(formatted.deaths, alertFactory.alert.duration);

                if (formatted.factionAbv !== null) {
                    alertFactory.metrics.factions[formatted.factionAbv].players++;
                }

                alertFactory.metrics.players.push(formatted);
                return resolve();
            });
        });
    };

    factory.addNewOutfit = function(outfit) {
        return new Promise(function(resolve) {
            var formatted = {
                id:           outfit.outfit.id,
                name:         outfit.outfit.name,
                tag:          outfit.outfit.tag,
                faction:      outfit.outfit.faction,
                kills:        outfit.metrics.kills,
                deaths:       outfit.metrics.deaths,
                teamkills:    outfit.metrics.teamkills,
                suicides:     outfit.metrics.suicides,
                players:      [], // Will store all playerIDs for reference
                participants: 0,
                killsPerParticipant: 0,
                deathsPerParticipant: 0,
                captures: 0
            };

            if (!formatted.tag || formatted.tag.length === 0) {
                formatted.tag = null;
            }

            formatted.factionAbv = ConfigDataService.convertFactionIntToName(formatted.faction);
            formatted.kd = MetricsProcessingService.calcKD(formatted.kills, formatted.deaths); // Parse KD
            formatted.kpm = (formatted.kills / alertFactory.alert.durationMins).toFixed(2);
            formatted.dpm = (formatted.deaths / alertFactory.alert.durationMins).toFixed(2);

            alertFactory.metrics.outfits.push(formatted);
            resolve();
        });
    };

    factory.addNewWeapon = function(weapon) {
        return new Promise(function(resolve) {
            var newWeaponGroupFlag = false;
            if (weapon.id > 0) {
                // Find the array key for the weapon by ID
                var weaponRef = _.findIndex(
                    alertFactory.configData.weapons.data, {'id': weapon.id}
                );

                var weaponData = alertFactory.configData.weapons.data[weaponRef];

                if (weaponData) {
                    // Do a check to see if the weapon we have, by name, is already in the data array. This is to merge the
                    // cross faction vehicle weapons into a singular weapon
                    var index = _.findIndex(
                        alertFactory.metrics.weapons, {'name': weaponData.name}
                    );

                    // If weapon by name has been found, check if we have a special fake weapon for the group
                    var groupIndex = _.findIndex(
                        alertFactory.metrics.weapons, {
                            name: weaponData.name + ' (Grouped)'
                        }
                    );

                    // If there is no faked "group" weapon
                    if (groupIndex === -1 && index !== -1) {
                        var existingWeapon = alertFactory.metrics.weapons[index];
                        var random = Math.floor(Math.random() * 10000);

                        var newGroup = {
                            id:         weapon.id + '00000' + random, // Scramble the ID
                            name:       weaponData.name + ' (Grouped)',
                            kills:      (weapon.kills + existingWeapon.kills),
                            teamkills:  (weapon.teamkills + existingWeapon.teamkills),
                            headshots:  (weapon.headshots + existingWeapon.headshots),
                            vehicle:    weaponData.isVehicle,
                            faction:    0,
                            factionAbv: 'grouped',
                            weapons:    [weapon.id]
                        };

                        newGroup.hsr = MetricsProcessingService.calcHSR(newGroup.headshots, newGroup.kills);
                        newGroup.kpm = MetricsProcessingService.getKpm(newGroup.kills, alertFactory.alert.duration);

                        alertFactory.metrics.weapons.push(newGroup);
                        newWeaponGroupFlag = true;
                    }

                    // Else, if the grouped weapon was indeed found, increase it's stats
                    if (groupIndex !== -1) {
                        var weaponGroup = alertFactory.metrics.weapons[groupIndex];

                        weaponGroup.kills     += weapon.kills;
                        weaponGroup.teamkills += weapon.teamkills;
                        weaponGroup.headshots += weapon.headshots;
                        weaponGroup.faction    = 0;

                        weaponGroup.hsr = MetricsProcessingService.calcHSR(weaponGroup.headshots, weaponGroup.kills);
                        weaponGroup.kpm = MetricsProcessingService.getKpm(weaponGroup.kills, alertFactory.alert.duration);

                        weaponGroup.weapons.push(weapon.id); // Push this weapon to the group
                    }

                    // Continue adding the weapon as a single entity
                    var formatted = {
                        id:        weapon.id,
                        name:      weaponData.name,
                        kills:     weapon.kills,
                        teamkills: weapon.teamkills,
                        headshots: weapon.headshots,
                        vehicle:   weaponData.isVehicle,
                        faction:   weaponData.faction
                    };

                    // Set faction abrivation
                    formatted.factionAbv = ConfigDataService.convertFactionIntToName(formatted.faction);

                    formatted.hsr = MetricsProcessingService.calcHSR(formatted.headshots, formatted.kills);
                    formatted.kpm = MetricsProcessingService.getKpm(formatted.kills, alertFactory.alert.duration);
                    formatted.dpm = MetricsProcessingService.getKpm(formatted.deaths, alertFactory.alert.duration);

                    alertFactory.metrics.weapons.push(formatted);
                    resolve(newWeaponGroupFlag);
                } else {
                    console.log('Invalid / Not found Weapon Data: ', weapon.id);
                }
            } else {
                console.log('Invalid Weapon ID: ', weapon.id);
            }
        });
    };

    factory.addNewVehicle = function(vehicle) {
        return new Promise(function(resolve) {
            if (vehicle.id > 0) {
                var vehicleRef = _.findIndex(
                    alertFactory.configData.vehicles.data, {'id': vehicle.id}
                );

                if (vehicleRef !== -1) {
                    var vehicleData = alertFactory.configData.vehicles.data[vehicleRef];

                    var formatted = {
                        id:      vehicle.id,
                        name:    vehicleData.name,
                        type:    vehicleData.type,
                        faction: vehicleData.faction,
                        kills:   vehicle.kills.total,
                        killsI:  vehicle.kills.infantry,
                        killsV:  vehicle.kills.vehicle,
                        deaths:  vehicle.deaths.total,
                        deathsI: vehicle.deaths.infantry,
                        deathsV: vehicle.deaths.vehicle,
                        bails:   vehicle.bails
                    };

                    formatted.factionAbv = ConfigDataService.convertFactionIntToName(formatted.faction);

                    formatted.kd = MetricsProcessingService.calcKD(formatted.kills, formatted.deaths); // Parse KD
                    formatted.kpm = MetricsProcessingService.getKpm(formatted.kills, alertFactory.alert.duration);
                    formatted.dpm = MetricsProcessingService.getKpm(formatted.deaths, alertFactory.alert.duration);

                    alertFactory.metrics.vehicles.push(formatted);
                    resolve();
                } else {
                    console.log('Invalid Vehicle ID: ', vehicle.id);
                }
            }
        });
    };

    factory.addNewCapture = function(capture) {
        return new Promise(function(resolve) {
            var formatted = {
                timestamp: capture.timestamp * 1000,
                defence:   capture.isDefence,
                vs:        parseInt(capture.controlVS),
                nc:        parseInt(capture.controlNC),
                tr:        parseInt(capture.controlTR),
                captor:    capture.facilityNewFaction,
                looser:    capture.facilityOldFaction
            };

            formatted.total = (formatted.vs + formatted.nc + formatted.tr);
            formatted.neutral = 100 - formatted.total;

            var facilityConfRef = _.findIndex(
                alertFactory.configData.facilities.data, {'id': capture.facilityID}
            );

            var facilityStatsRef = _.findIndex(
                alertFactory.metrics.facilities, {'id': capture.facilityID}
            );

            if (capture.outfitCaptured && capture.outfitCaptured > 0) {
                alertFactory.getOutfit(capture.outfitCaptured).then(function(outfit) {
                    if (outfit) {
                        formatted.outfitName = outfit.name;
                        formatted.outfitTag  = outfit.tag;

                        // Update outfit metrics
                        if (formatted.defence === true) {
                            outfit.defences++;
                        } else {
                            outfit.captures++;
                        }
                    } else {
                        console.log('=== Outfit data could not be determined! ===');
                    }
                });
            }
            if (facilityConfRef !== -1) {
                var facility = alertFactory.configData.facilities.data[facilityConfRef];
                formatted.facilityId    = facility.id;
                formatted.facilityName  = facility.name;
                formatted.facilityType  = facility.type;
                formatted.facilityMapId = facility.mapId;

                // Create new facility stats entry
                if (facilityStatsRef === -1) {
                    var newFacility = {
                        id: facility.id,
                        name: facility.name,
                        type: ConfigDataService.facilityTypes[facility.type],
                        typeSmall: ConfigDataService.facilityTypesSmall[facility.type],
                        captures: 0,
                        defences: 0,
                    };

                    if (formatted.defence === true) {
                        newFacility.defences = 1;
                    } else {
                        newFacility.captures = 1;
                    }

                    alertFactory.metrics.facilities.push(newFacility);
                } else { // Update facility stats entry
                    var entry = alertFactory.metrics.facilities[facilityStatsRef];
                    if (formatted.defence === true) {
                        entry.defences++;
                    } else {
                        entry.captures++;
                    }
                }
            }

            formatted.dateTime = $filter('date')(formatted.timestamp, 'HH:mm:ss');

            formatted.captorFactionAbv = ConfigDataService.convertFactionIntToName(formatted.captor);
            formatted.looserFactionAbv = ConfigDataService.convertFactionIntToName(formatted.looser);

            if (formatted.defence === true) {
                alertFactory.metrics.map.defences.push(formatted);
            } else {
                alertFactory.metrics.map.captures.push(formatted);
            }

            alertFactory.metrics.map.all.push(formatted);

            // Update territory bar
            alertFactory.controlVS = formatted.vs;
            alertFactory.controlNC = formatted.nc;
            alertFactory.controlTR = formatted.tr;
            alertFactory.controlNeutral = formatted.neutral;
            resolve();
        });
    };

    return factory;
});
