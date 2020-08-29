app.service('HomeCombatStatisticsService', function($http, $log, ConfigDataService) {
    var factory = {
        metrics: {},
        classMetrics: {}
    };

    factory.metricsLoaded = 0;
    factory.classMetricsLoaded = 0;

    // Instantiate the object properties
    factory.init = function() {
        var metrics = ['kills', 'deaths', 'teamkills', 'suicides', 'headshots'];
        var factions = ['vs', 'nc', 'tr'];
        var servers = _.clone(ConfigDataService.servers);
        servers.push('all');

        angular.forEach(servers, function(server) {
            factory.metrics[server] = {};
            factory.metrics[server].totals = {
                kills: 0,
                deaths: 0,
                teamkills: 0,
                suicides: 0,
                headshots: 0
            };
            angular.forEach(metrics, function(metric) {
                factory.metrics[server][metric] = {};

                angular.forEach(ConfigDataService.factions, function(faction) {
                    if (faction !== 'draw') {
                        factory.metrics[server][metric][faction] = 0;
                    }
                });
            });
        });

        // Get the data
        $http({
            method: 'GET',
            url: ConfigDataService.apiUrl + '/alerts/combat/totals'
        }).then(function(data) {
            factory.metrics = data.data;
            factory.metricsLoaded = 1;

            setTimeout(function() {
                $('#home-combat-metrics .tooltipped').tooltip({
                    delay: 50
                });
            }, 250); // Ewwwww
        });

        $http({
            method: 'GET',
            url: ConfigDataService.apiUrl + '/alerts/combat/classTotals'
        }).then(function(data) {
            factory.classMetrics = data.data;
            factory.classMetricsLoaded = 1;

            setTimeout(function() {
                $('#home-class-metrics .tooltipped').tooltip({
                    delay: 50
                });
            }, 250); // Ewwwww
        });
    };

    return factory;
});
