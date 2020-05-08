app.service('OutfitProfileService', function(
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
            factory.configData = result[0];
            // FIRE
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
                url    : ConfigDataService.apiUrl + '/profiles/outfit/' + id + '?embed=facilities,metrics,involvement,players'
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

        factory.processCaptures();

        console.log(factory);

        $rootScope.$broadcast('dataLoaded', 'loaded');
    };

    factory.processCaptures = function() {
        factory.metrics.captures = 0;
        factory.metrics.defences = 0;

        if (factory.data.facilities.data.length > 0) {
            _.forEach(factory.data.facilities.data, function(value, key) {
                factory.metrics.defences += value.defences;
                factory.metrics.captures += value.captures;

                if (value.id !== 0) {
                    var ref = _.findIndex(
                        factory.configData.facilities.data, { 'id' : value.id }
                    );

                    if (ref >= 0) {
                        var data = factory.configData.facilities.data[ref];
                        value.name = data.name;
                        value.type = data.type;
                        value.zone = ConfigDataService.zoneNames[data.zone];
                        value.type = ConfigDataService.facilityTypesSmall[data.type];
                    } else {
                        value.name = 'UNKNOWN!';
                        value.type = null;
                        value.zoneName = null;
                    }
                } else {
                    value.name = "UNKNOWN!!";
                    value.type = null;
                    value.zoneName = null;
                }
            });
        }
    };

    return factory;
});
