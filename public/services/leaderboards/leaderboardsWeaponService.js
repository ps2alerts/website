app.service('LeaderboardWeaponService', function(
    $http,
    $rootScope,
    ConfigDataService,
    MetricsProcessingService
) {
    var factory = {};
    factory.sorting = 'kills';

    factory.getConfig = function() {
        $rootScope.$broadcast('loading', 'blah');
        Promise.all([
            factory.getConfigData
        ]).then(function(result) {
            factory.configData = result[0];
            $rootScope.$broadcast('configReady', 'loaded');
        });
    }

    factory.getTopWeapons = function(sorting) {
        factory.weaponData = {}; // Reset Data

        // Fix for indexOf on filters showing up Kills and Teamkills
        if (sorting === 'tks') {
            sorting = 'teamkills';
        }

        // Used by sorting functions for weapon data at processing
        factory.sorting = sorting;

        var fieldQuery = 'field='+sorting;

        $http({
            method : 'GET',
            url    : ConfigDataService.apiUrl + '/leaderboards/weapons?'+fieldQuery +'&limit=100000'
        }).then(function(returned) {
            factory.weaponData = returned.data.data;

            factory.processWeapons(factory.weaponData);
            $rootScope.$broadcast('weapons-loaded');
        });
    };

    factory.processWeapons = function(data) {
        factory.weaponData = [];

        // First, get all the weapons, merge their groups together, and get the weapon data
        _.forEach(data, function(weapon, key) {
            if (weapon.id > 0) {
                // Find the array key for the weapon by ID
                var weaponRef = _.findIndex(
                    factory.configData.weapons.data, {'id' : weapon.id}
                );

                var weaponData = factory.configData.weapons.data[weaponRef];

                if (weaponData) {
                    // Do a check to see if the weapon we have, by name, is already in the data array. This is to merge
                    // the cross faction vehicle weapons into a singular weapon
                    var index = _.findIndex(
                        factory.weaponData, {'name': weaponData.name}
                    );

                    // If weapon by name has been found, check if we have a special fake weapon for the group
                    var groupIndex = _.findIndex(
                        factory.weaponData, {
                            'name'   : weaponData.name + ' (Grouped)'
                        }
                    );

                    // If there is no faked "group" weapon
                    if (groupIndex === -1 && index !== -1) {
                        var existingWeapon = factory.weaponData[index];
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
                            weapons:    [weapon.id],
                        };

                        newGroup.hsr = MetricsProcessingService.calcHSR(newGroup.headshots, newGroup.kills);

                        factory.weaponData.push(newGroup);
                    }

                    // Else, if the grouped weapon was indeed found, increase it's stats
                    if (groupIndex !== -1) {
                        var weaponGroup = factory.weaponData[groupIndex];

                        weaponGroup.kills     += weapon.kills;
                        weaponGroup.teamkills += weapon.teamkills;
                        weaponGroup.headshots += weapon.headshots;
                        weaponGroup.faction    = 0;

                        weaponGroup.hsr = MetricsProcessingService.calcHSR(weaponGroup.headshots, weaponGroup.kills);

                        weaponGroup.weapons.push(weapon.id); // Push this weapon to the group
                    }

                    // Continue adding the weapon as a single entity
                    var newWeapon = {
                        id:        weapon.id,
                        name:      weaponData.name,
                        kills:     weapon.kills,
                        teamkills: weapon.teamkills,
                        headshots: weapon.headshots,
                        vehicle:   weaponData.isVehicle,
                        faction:   weaponData.faction
                    };

                    newWeapon.hsr = MetricsProcessingService.calcHSR(weapon.headshots, weapon.kills);
                    // Set faction abrivation
                    newWeapon.factionAbv = ConfigDataService.convertFactionIntToName(newWeapon.faction);

                    factory.weaponData.push(newWeapon);
                } else {
                    console.log("Invalid Weapon ID: ", weapon.id);
                }
            }
        });

        // Second, resort all of the weapons by kills

        var pos = 1;

        factory.weaponData = _.sortBy(factory.weaponData, [factory.sorting]);

        factory.weaponData.reverse();

        _.forEach(factory.weaponData, function(weapon, key) {
            weapon.pos = pos;
            weapon.kills = weapon.kills.toLocaleString();
            weapon.teamkills = weapon.teamkills.toLocaleString();
            weapon.headshots = weapon.headshots.toLocaleString();
            pos++;
        });
    }

    factory.getConfigData = new Promise(function(resolve, reject) {
        $http({
            method : 'GET',
            url    : ConfigDataService.apiUrl + '/data?embed=facilities,vehicles,weapons,xps'
        }).then(function(returned) {
            return resolve(returned.data.data);
        });
    });

    return factory;
});
