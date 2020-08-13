app.service('RealtimeMetricsService', function(
    $http,
    $filter,
    AlertTransformer,
    AlertMetricsProcessingService,
    AlertWebsocketService,
    ConfigDataService,
    PS2AlertsAPIService,
    MetricsProcessingService
) {
    var alertFactory = {};
    var factory = {};

    var kpmInterval;
    var durationInterval;
    var redrawInterval;
    factory.selectedTab = 'players';

    factory.init = function(alertFactoryData) {
        alertFactory = alertFactoryData;

        // Alert Countdown && websocket subscription
        if (alertFactory.alert.ended == 0) {
            if (alertFactory.alert.inProgress) {
                // Subscribe to alert websocket
                AlertWebsocketService.initAndSubscribe(alertFactory.alert.id);

                // Set the initial values
                factory.recalculateMetricKpms();
                factory.processLeaderboardMetrics().then();

                // Set off the KPM / DPM interval
                kpmInterval = setInterval(function() {
                }, 5000);

                durationInterval = setInterval(function() {
                    var now = new Date().getTime();
                    alertFactory.alert.duration = now - alertFactory.alert.started;
                    alertFactory.alert.durationTime = $filter('date')(
                        alertFactory.alert.duration - 1, // -1 second due to Census lag
                        'HH:mm:ss',
                        'UTC'
                    );
                    alertFactory.alert.durationMins = Math.round((alertFactory.alert.duration / 1000) / 60);
                    factory.recalculateMetricKpms();
                }, 1000);

                redrawInterval = setInterval(function() {
                    factory.processLeaderboardMetrics().then(function() {
                        factory.refreshLeaderboards();
                    });
                }, 2000);
            }
        }
    };

    factory.refreshLeaderboards = function() {
        if (factory.selectedTab === 'players') {
            $('#player-leaderboard').DataTable().rows().invalidate().draw('full-hold');
        }
        if (factory.selectedTab === 'outfits') {
            $('#outfit-leaderboard').DataTable().rows().invalidate().draw('full-hold');
        }
        if (factory.selectedTab === 'weapons') {
            $('#weapon-leaderboard').DataTable().rows().invalidate().draw('full-hold');
        }
        if (factory.selectedTab === 'vehicles') {
            $('#vehicle-leaderboard').DataTable().rows().invalidate().draw('full-hold');
        }
    };

    factory.changeTab = function(tab) {
        factory.selectedTab = tab;
        factory.refreshLeaderboards();
    };

    factory.increaseCombatKills = function(message) {
        if (message.suicide === true) {
            alertFactory.metrics.combat.suicides[message.attackerFactionAbv]++;
            alertFactory.metrics.combat.suicides.total++;
        }

        if (message.teamkill === true) {
            alertFactory.metrics.combat.teamkills[message.attackerFactionAbv]++;
            alertFactory.metrics.combat.teamkills.total++;
        }

        // If a suicide or a TK, don't give the attacker credit
        if (message.suicide === false && message.teamkill === false) {
            alertFactory.metrics.combat.kills[message.attackerFactionAbv]++;
            alertFactory.metrics.combat.kills.total++;
        }

        alertFactory.metrics.combat.deaths[message.victimFactionAbv]++;
        alertFactory.metrics.combat.deaths.total++;
    };

    // Goes off and finds the references, and adds players if required
    factory.populateCombatPlayers = function(message) {
        return new Promise(function(resolve, reject) {
            if (
                ConfigDataService.maelChar(message.attackerID) ||
                ConfigDataService.maelChar(message.victimID)
            ) {
                console.log('Developer charater found in populateCombatPlayers!', message);
            }

            // PROCESS ATTACKER
            // Find player records
            var attackerRef = _.findIndex(
                alertFactory.metrics.players, {'id': message.attackerID}
            );
            var victimRef = _.findIndex(
                alertFactory.metrics.players, {'id': message.victimID}
            );

            var attacker = alertFactory.metrics.players[attackerRef];
            var victim = alertFactory.metrics.players[victimRef];

            var promises = []; // Build an array of promises to execute
            var newAttackerSet = false;
            var newVictimSet = false;

            var newAttacker = {
                player: {
                    id: message.attackerID,
                    faction: message.attackerFaction,
                    name: message.attackerName,
                    outfitID: message.attackerOutfit.id,
                },
                metrics: {
                    kills: 0, // 0 as kills etc are added later pn
                    deaths: 0, // Ditto
                    suicides: 0,
                    teamkills: 0,
                    headshots: 0
                }
            };

            var newVictim = _.clone(newAttacker);

            // If NOT found, supply the data to addNewPlayer
            if (!attacker) {
                promises.push(AlertMetricsProcessingService.addNewPlayer(newAttacker));
                newAttackerSet = true;
            }

            if (!victim && message.attackerID !== message.victimID) {
                console.log('Victim not found... adding');
                newVictim.id = message.victimID;
                newVictim.faction = message.victimFaction;
                newVictim.name = message.victimName;
                newVictim.outfitID = message.victimOutfit.id;
                promises.push(AlertMetricsProcessingService.addNewPlayer(newVictim));
                newVictimSet = true;
            }

            if (promises.length > 0) {
                console.log('Promises', promises);
                // If we've had to make changes, update the data we send back
                Promise.all(promises).then(function() {
                    attackerRef = _.findIndex(
                        alertFactory.metrics.players, {'id': message.attackerID}
                    );
                    attacker = alertFactory.metrics.players[attackerRef];
                    victimRef = _.findIndex(
                        alertFactory.metrics.players, {'id': message.victimID}
                    );
                    victim = alertFactory.metrics.players[victimRef];

                    if (!attacker || !victim) {
                        var which = 'Attacker';

                        if (!victim) {
                            which = 'Victim';
                        }

                        if (!attacker && !victim) {
                            which = 'Both';
                        }
                        console.log('attackerID', message.attackerID);
                        console.log('victimID', message.victimID);
                        reject(which + ' could not be determined, EVEN AFTER PROMISE!');
                    }
                    resolve({
                        attacker: attacker,
                        victim: victim,
                        newAttacker: newAttackerSet,
                        newVictim: newVictimSet
                    });
                });
            } else {
                if (!attacker || !victim) {
                    reject('Attacker or Victim could not be determined!');
                }
                resolve({
                    attacker: attacker,
                    victim: victim,
                    newAttacker: newAttackerSet,
                    newVictim: newVictimSet
                });
            }
        });
    };

    factory.updatePlayerMetrics = function(message) {
        return new Promise(function(resolve) {
            // Run promise to ENSURE that we get the correct player data, even if we have to insert it at this point
            Promise.all([
                factory.populateCombatPlayers(message)
            ]).then(function(result) {
                var attacker = result[0].attacker;
                var victim = result[0].victim;
                var newAttacker = result[0].newAttacker;
                var newVictim = result[0].newVictim;

                if (
                    ConfigDataService.maelChar(result[0].attacker.id) ||
                    ConfigDataService.maelChar(result[0].victim.id)
                ) {
                    console.log('Developer character found in UpdatePlayerMetrics');
                    console.log('attacker', attacker);
                    console.log('victim', victim);
                }

                // Now we're sure that their stats are in place, increase them!

                // Don't add kills etc if they are a suicide
                if (attacker.id != victim.id && message.suicide === false) {
                    if (message.teamkill === false) {
                        attacker.kills++;
                    }
                    message.headshot === true ? attacker.headshots++ : false;
                    message.teamkill === true ? attacker.teamkills++ : false;

                    attacker.hsr = MetricsProcessingService.calcHSR(attacker.headshots, attacker.kills).toFixed(2);
                    attacker.kd = MetricsProcessingService.calcKD(attacker.kills, attacker.deaths).toFixed(2); // Parse KD
                }

                attacker.kpm = MetricsProcessingService.getKpm(attacker.kills, alertFactory.alert.duration);

                // Victim
                victim.deaths++;
                message.suicide === true ? victim.suicides++ : false;

                victim.kd = MetricsProcessingService.calcKD(victim.kills, victim.deaths).toFixed(2); // Parse KD
                victim.dpm = MetricsProcessingService.getKpm(victim.deaths, alertFactory.alert.duration);

                if (newAttacker) {
                    $('#player-leaderboard').DataTable().row.add(attacker);
                    $('#player-leaderboard').DataTable().draw('full-hold');
                }

                if (newVictim) {
                    $('#player-leaderboard').DataTable().row.add(victim);
                    $('#player-leaderboard').DataTable().draw('full-hold');
                }

                // Redraw will be handled by global redraw interval
                resolve();
            });
        });
    };

    factory.updateOutfitMetrics = function(message) {
        return new Promise(function(resolve) {
            var newAttacker = false;
            var newVictim = false;

            if (message.attackerOutfit.id !== null && message.attackerOutfit.id != 0) {
                // Calculate -3, -2, -1 etc for players without outfits
                message.attackerOutfit.id = MetricsProcessingService.getNoOutfitID(message.attackerFaction);

                alertFactory.getOutfit(message.attackerOutfit.id).then(function(outfit) {
                    if (!outfit) {
                        console.log('getOutfit returned nothing for Attacker Outfit');
                        return false;
                    }

                    // Increment kills / deaths based on message
                    // Suicides will be handled at victim level
                    if (message.attackerID !== message.victimID) {
                        outfit.kills++;
                    }

                    if (message.teamkill === true) {
                        outfit.teamkills++;
                    }

                    // Update outfit metrics
                    outfit.kd = MetricsProcessingService.calcKD(outfit.kills, outfit.deaths);
                    outfit.killsPerParticipant = (outfit.kills / outfit.participants).toFixed(2);
                    outfit.deathsPerParticipant = (outfit.deaths / outfit.participants).toFixed(2);

                    /*if (new) {
                        console.log('Adding outfit attacker to leaderboard');
                        $('#outfit-leaderboard').DataTable().row.add(outfit);
                        $('#outfit-leaderboard').DataTable().draw();
                    }*/
                });
            }

            if (message.victimOutfit.id !== null && message.victimOutfit.id != 0) {
                // Calculate -3, -2, -1 etc for players without outfits
                message.victimOutfit.id = MetricsProcessingService.getNoOutfitID(message.victimFaction);

                alertFactory.getOutfit(message.victimOutfit.id).then(function(outfit) {
                    if (!outfit) {
                        console.log('getOutfit returned nothing for Victim Outfit');
                        return false;
                    }
                    // Increment kills / deaths based on message
                    // Suicides will be handled at victim level
                    outfit.deaths++;

                    if (message.suicide === true) {
                        outfit.deaths++;
                        outfit.suicides++;
                    }

                    // Update outfit metrics
                    outfit.kd = MetricsProcessingService.calcKD(outfit.kills, outfit.deaths);
                    outfit.killsPerParticipant = (outfit.kills / outfit.participants).toFixed(2);
                    outfit.deathsPerParticipant = (outfit.deaths / outfit.participants).toFixed(2);
                    /*if (new) {
                        console.log('Adding outfit victim to leaderboard');
                        $('#outfit-leaderboard').DataTable().row.add(outfit);
                    }*/
                });
            }

            // Redraws handled by global redraw interval
            resolve();
        });
    };

    factory.updateWeaponMetrics = function(message) {
        return new Promise(function(resolve) {
            if (!message.weaponID || message.weaponID == 0) {
                console.log('Invalid weapon ID found, ignoring');
                resolve();
            }

            var weaponRef = _.findIndex(
                alertFactory.metrics.weapons, {'id': message.weaponID}
            );

            if (weaponRef > 0) {
                var weapon = alertFactory.metrics.weapons[weaponRef];

                weapon.kills++;
                message.teamkill ? weapon.teamkills++ : false;
                message.headshot ? weapon.headshots++ : false;
                weapon.hsr = MetricsProcessingService.calcHSR(weapon.headshots, weapon.kills);
                weapon.kpm = MetricsProcessingService.getKpm(weapon.kills, alertFactory.alert.duration);

                var weaponRef = _.findIndex(
                    alertFactory.configData.weapons.data, {'id': weapon.id}
                );

                var weaponData = alertFactory.configData.weapons.data[weaponRef];

                // Update weapon groups
                var groupIndex = _.findIndex(
                    alertFactory.metrics.weapons, {
                        name: weaponData.name + ' (Grouped)'
                    }
                );

                var weaponGroup = {};

                if (groupIndex > 0) {
                    var weaponGroup = alertFactory.metrics.weapons[groupIndex];

                    weaponGroup.kills++;
                    message.teamkill ? weaponGroup.teamkills++ : false;
                    message.headshot ? weaponGroup.headshots++ : false;
                    weaponGroup.hsr = MetricsProcessingService.calcHSR(weaponGroup.headshots, weaponGroup.kills);
                    weaponGroup.kpm = MetricsProcessingService.getKpm(weaponGroup.kills, alertFactory.alert.duration);

                    // console.log('Updated weaponGroup', weaponGroup);
                }

                // Redraws handled by global redraw interval
                resolve();
            } else {
                var newWeapon = {
                    id: message.weaponID,
                    kills: 1,
                    teamkills: message.teamkill ? 1 : 0,
                    headshots: message.headshot ? 1 : 0
                };

                AlertMetricsProcessingService.addNewWeapon(newWeapon).then(function() {
                    resolve();
                });
            };
        });
    };

    factory.updateVehicleMetrics = function(message) {
        return new Promise(function(resolve) {
            // console.log(message);
            /*if (!message.weaponID || message.weaponID == 0) {
                console.log('Invalid weapon ID found, ignoring');
                resolve();
            }

            var weaponRef = _.findIndex(
                alertFactory.metrics.weapons, {'id': message.weaponID}
            );

            if (weaponRef > 0) {
                var weapon = alertFactory.metrics.weapons[weaponRef];

                weapon.kills++;
                message.teamkill ? weapon.teamkills++ : false;
                message.headshot ? weapon.headshots++ : false;
                weapon.hsr = MetricsProcessingService.calcHSR(weapon.headshots, weapon.kills);
                weapon.kpm = MetricsProcessingService.getKpm(weapon.kills, alertFactory.alert.duration);

                var weaponRef = _.findIndex(
                    alertFactory.configData.weapons.data, {'id': weapon.id}
                );

                var weaponData = alertFactory.configData.weapons.data[weaponRef];

                // Update weapon groups
                var groupIndex = _.findIndex(
                    alertFactory.metrics.weapons, {
                        name: weaponData.name + ' (Grouped)'
                    }
                );

                var weaponGroup = {};

                if (groupIndex > 0) {
                    var weaponGroup = alertFactory.metrics.weapons[groupIndex];

                    weaponGroup.kills++;
                    message.teamkill ? weaponGroup.teamkills++ : false;
                    message.headshot ? weaponGroup.headshots++ : false;
                    weaponGroup.hsr = MetricsProcessingService.calcHSR(weaponGroup.headshots, weaponGroup.kills);
                    weaponGroup.kpm = MetricsProcessingService.getKpm(weaponGroup.kills, alertFactory.alert.duration);

                    // console.log('Updated weaponGroup', weaponGroup);
                }

                // Redraws handled by global redraw interval
                resolve();
            } else {
                var newWeapon = {
                    id: message.weaponID,
                    kills: 1,
                    teamkills: message.teamkill ? 1 : 0,
                    headshots: message.headshot ? 1 : 0
                };

                AlertMetricsProcessingService.addNewWeapon(newWeapon).then(function() {
                    resolve();
                });
            };*/
        });
    };

    factory.processMapCapture = function(message) {
        AlertMetricsProcessingService.addNewCapture(message);
    };

    factory.recalculateMetricKpms = function() {
        var combatMetrics = alertFactory.metrics.combat;
        alertFactory.metrics.kpms = {
            total: MetricsProcessingService.getKpm(combatMetrics.kills.total, alertFactory.alert.duration),
            vs: MetricsProcessingService.getKpm(combatMetrics.kills.vs, alertFactory.alert.duration),
            nc: MetricsProcessingService.getKpm(combatMetrics.kills.nc, alertFactory.alert.duration),
            tr: MetricsProcessingService.getKpm(combatMetrics.kills.tr, alertFactory.alert.duration),
        };

        alertFactory.metrics.dpms = {
            total: MetricsProcessingService.getKpm(combatMetrics.deaths.total, alertFactory.alert.duration),
            vs: MetricsProcessingService.getKpm(combatMetrics.deaths.vs, alertFactory.alert.duration),
            nc: MetricsProcessingService.getKpm(combatMetrics.deaths.nc, alertFactory.alert.duration),
            tr: MetricsProcessingService.getKpm(combatMetrics.deaths.tr, alertFactory.alert.duration),
        };
    };

    // Fires every 5 secs to update the KPMs / DPMs of every player, otherwise until they get a kill
    // they will always have the same. Promised so we're not redrawing on EVERY player
    factory.processLeaderboardMetrics = function() {
        return new Promise(function(resolve) {
            angular.forEach(alertFactory.metrics.players, function(player) {
                player.kpm = MetricsProcessingService.getKpm(player.kills, alertFactory.alert.duration);
                player.dpm = MetricsProcessingService.getKpm(player.deaths, alertFactory.alert.duration);
            });
            angular.forEach(alertFactory.metrics.outfits, function(outfit) {
                outfit.kpm = MetricsProcessingService.getKpm(outfit.kills, alertFactory.alert.duration);
                outfit.dpm = MetricsProcessingService.getKpm(outfit.deaths, alertFactory.alert.duration);

                // Zero the KPMs / DPMs so that tiny outfits cannot pollute the KD metric during primetime
                if (alertFactory.alert.timeBracket === 'PRI' && outfit.players.length < 5) {
                    outfit.kd = 0;
                }
            });
            angular.forEach(alertFactory.metrics.weapons, function(weapon) {
                weapon.kpm = MetricsProcessingService.getKpm(weapon.kills, alertFactory.alert.duration);
            });

            angular.forEach(alertFactory.metrics.vehicles, function(vehicle) {
                vehicle.kpm = MetricsProcessingService.getKpm(vehicle.kills, alertFactory.alert.duration);
                vehicle.dpm = MetricsProcessingService.getKpm(vehicle.deaths, alertFactory.alert.duration);
            });

            resolve();
        });
    };

    factory.endAlert = function() {
        console.log('Clearing Intervals');
        // Cancel KPM calculations
        clearInterval(kpmInterval);
        clearInterval(durationInterval);
        clearInterval(redrawInterval);
    };

    return factory;
});
