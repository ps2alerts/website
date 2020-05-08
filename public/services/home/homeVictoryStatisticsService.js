app.service('HomeVictoryStatisticsService', function($http, $log, ConfigDataService) {
    var factory = {
        victories: {},
        dominations: {},
        totals: {
            alerts: {
                total: 0
            },
            dominations: {
                total: 0
            }
        }
    };

    factory.increaseAlertTotal = function() {
        factory.totals.alerts.total++;
    };

    factory.increaseDominationTotal = function() {
        factory.totals.dominations.total++;
    };

    factory.increaseVictories = function(server, faction) {
        if (factory.victories && factory.totals) {
            factory.victories[server][faction]++;
            factory.totals.alerts[faction]++;
        }
    };

    factory.increaseDominations = function(server, faction) {
        factory.dominations[server][faction]++;
        factory.totals.dominations[faction]++;
    };

    factory.init = function() {
        // Instantiate the object properties

        factory.totals.alerts.total = 0;
        factory.totals.dominations.total = 0;

        angular.forEach(ConfigDataService.servers, function(server) {
            angular.forEach(ConfigDataService.factions, function(faction) {
                factory.victories[server]   = {};
                factory.dominations[server] = {};

                factory.victories[server][faction]   = 0;
                factory.dominations[server][faction] = 0;

                factory.totals.alerts[faction]      = 0;
                factory.totals.dominations[faction] = 0;
            });
        });

        // Get the data
        $http({
            method: 'GET',
            url: ConfigDataService.apiUrl + '/alerts/counts/victories'
        }).then(function(data) {
            var returned = data.data.data; // #Dataception
            angular.forEach(returned, function(values, server) {
                angular.forEach(ConfigDataService.factions, function(faction) {
                    factory.victories[server][faction] = values.data[faction];
                    factory.totals.alerts[faction]    += values.data[faction];
                });

                factory.totals.alerts.total += values.data.total;
            });
        });

        $http({
            method: 'GET',
            url: ConfigDataService.apiUrl + '/alerts/counts/dominations'
        }).then(function(data) {
            var returned = data.data.data; // #Dataception
            angular.forEach(returned, function(values, server) {
                angular.forEach(ConfigDataService.factions, function(faction) {
                    factory.dominations[server][faction] = values.data[faction];
                    factory.totals.dominations[faction] += values.data[faction];
                });

                factory.totals.dominations.total += values.data.total;
            });
        });
    };

    return factory;
});
