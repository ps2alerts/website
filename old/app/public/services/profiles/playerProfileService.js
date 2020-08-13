app.service('PlayerProfileService', function(
    $http,
    $log,
    $rootScope,
    ConfigDataService,
    MetricsProcessingService
) {
    var factory = {
        data: {},
        metrics: {}
    };

    // Called from the controller to initialise getting a player's profile
    factory.getProfile = function(id) {
        factory.data = {};
        factory.metrics = {};
        Promise.all([
            factory.getConfigData,
            factory.getProfileData(id)
        ]).then(function(result) {
            //console.log('Promise completed', result);
            factory.configData = result[0];
            factory.startProcessing(result[1]);
        });
    };

    factory.getConfigData = new Promise(function(resolve, reject) {
        $http({
            method : 'GET',
            url    : ConfigDataService.apiUrl + '/data?embed=facilities,vehicles,weapons,xps'
        }).then(function(returned) {
            return resolve(returned.data.data);
        });
    });

    factory.getProfileData = function(id) {
        return new Promise(function(resolve, reject) {
            $http({
                method : 'GET',
                url    : ConfigDataService.apiUrl + '/profiles/player/' + id + '?embed=census,metrics,outfit,involvement,weapons'
            }).then(function(returned) {
                return resolve(returned.data.data);
            });
        });
    };

    factory.startProcessing = function(data) {
        factory.data = data;

        factory.data.serverName = ConfigDataService.serverNames[factory.data.server];
        factory.data.factionAbv = ConfigDataService.convertFactionIntToName(factory.data.faction);

        factory.metrics.kd = MetricsProcessingService.calcKD(data.metrics.data.kills, data.metrics.data.deaths);
        factory.metrics.killsPerAlert = (data.metrics.data.kills / data.metrics.data.involved).toFixed(2);
        factory.metrics.deathsPerAlert = (data.metrics.data.deaths / data.metrics.data.involved).toFixed(2);

        factory.parseWeapons();
        $rootScope.$broadcast('dataLoaded', 'loaded');
    };

    factory.parseWeapons = function(data) {
        _.forEach(factory.data.weapons.data, function(value, key) {
            if (value.id !== 0) {
                var weaponRef = _.findIndex(
                    factory.configData.weapons.data, { 'id' : value.id }
                );

                if (weaponRef >= 0) {
                    value.name = factory.configData.weapons.data[weaponRef].name;
                } else {
                    value.name = 'UNKNOWN!';
                }
            } else {
                value.name = "Roadkill / Fatality";
            }
        });
    };

    /* Disabled until data is fixed
    factory.parseVehicles = function(data) {
        var newVehicles = [];
        _.forEach(factory.data.vehicles.data, function(value, key) {
            if (value.id !== 0) {
                var vehicleRef = _.findIndex(
                    factory.configData.vehicles.data, { 'id' : value.id }
                );

                if (vehicleRef) {
                    value.name = factory.configData.vehicles.data[vehicleRef].name;
                } else {
                    value.name = 'UNKNOWN!';
                }
            } else {
                value.name = "Unknown Method";
            }

            var newVehicle = {
                id: value.id,
                name: value.name,
                kills: value.kills.total,
                killsInf: value.kills.infrantry,
                killsVeh: value.kills.vehicles,
                deaths: value.deaths.total,
                deathsInf: value.deaths.infrantry,
                deathsVeh: value.deaths.vehicles,
                bails: value.bails
            };

            newVehicles.push(newVehicle);
        });

        // Replace vehicles with new flattened objects for Datatable use
        factory.data.vehicles.data = newVehicles;
    };
    */
    return factory;
});
