app.service('HomeZoneVictoryService', function ($http, $rootScope, ConfigDataService) {
    var factory = {
        zones: {},
        zoneTotals: {},
        factionTotals: {
            all: 0
        },
        serverTotals: {}
    };

    factory.init = function() {
        // Instantiate the object properties
        _.forEach(ConfigDataService.zones, function (zone) {
            factory.zones[zone]      = {};
            factory.zoneTotals[zone] = {};
            _.forEach(ConfigDataService.servers, function (server) {
                factory.zones[zone][server] = {
                    total: 0
                };
                _.forEach(ConfigDataService.factions, function (faction) {
                    factory.zones[zone][server][faction] = 0;
                    factory.zoneTotals[zone][faction] = 0;
                });
            });
        });

        _.forEach(ConfigDataService.factions, function (faction) {
            factory.factionTotals[faction] = 0;
            factory.serverTotals[faction] = {};
            _.forEach(ConfigDataService.servers, function (server) {
                factory.serverTotals[faction][server] = {
                    count: 0,
                    per: 0
                };
            });
        });

        Promise.all([
            factory.getZoneData(2),
            factory.getZoneData(4),
            factory.getZoneData(6),
            factory.getZoneData(8)
        ]).then(function(result) {
            Promise.all([
                factory.handleZoneData(2, result[0]),
                factory.handleZoneData(4, result[1]),
                factory.handleZoneData(6, result[2]),
                factory.handleZoneData(8, result[3])
            ]).then(function(result) {
                // Calculate percentage contributions
                _.forEach(factory.serverTotals, function (servers, faction) {
                    _.forEach(servers, function(value, server) {
                        var obj = factory.serverTotals[faction][server];
                        obj.per = (obj.count / factory.factionTotals[faction]) * 100;
                    });
                });


                // Sort the object by number of wins
                var sortable = {};
                _.forEach(factory.serverTotals, function (servers, faction) {
                    sortable[faction] = [];
                    _.forEach(servers, function (server, key) {
                        sortable[faction].push([key, server]);
                    });
                });

                _.forEach(sortable, function (value, faction) {
                    sortable[faction].sort(function(a, b) {
                        if (a[1].count > b[1].count) {
                            return -1;
                        }

                        if (a[1].count == b[1].count) {
                            return 0;
                        }

                        return 1;
                    })
                });

                // Now we're sorted, rebuild the object
                factory.serverTotals = {};
                _.forEach(sortable, function (servers, faction) {
                    factory.serverTotals[faction] = {};

                    _.forEach(servers, function (values, key) {
                        factory.serverTotals[faction][key] = {
                            'server': values[0],
                            'value': values[1].count,
                            'per': values[1].per
                        };
                    });
                });

                $rootScope.$broadcast('zonesLoaded', 'loaded');
            });
        });
    }

    factory.getZoneData = function(zone) {
        return new Promise(function(resolve, reject) {
            $http({
                method : 'GET',
                url    : ConfigDataService.apiUrl + '/alerts/counts/victories?zones=' + zone
            }).then(function(data) {
                return resolve(data.data.data); //#Dataception
            });
        });
    };

    factory.handleZoneData = function(zone, data) {
        return new Promise(function(resolve, reject) {
            angular.forEach(data, function(values, server) {
                angular.forEach(ConfigDataService.factions, function(faction) {
                    factory.zones[zone][server][faction] = values.data[faction];
                    factory.zoneTotals[zone][faction] += values.data[faction];
                    factory.serverTotals[faction][server].count += values.data[faction];
                    factory.factionTotals[faction] += values.data[faction];

                });

                factory.factionTotals.all += values.data.total;
                factory.zones[zone][server].total = values.data.total;
            });

            return resolve();
        });
    };

    return factory;
});
