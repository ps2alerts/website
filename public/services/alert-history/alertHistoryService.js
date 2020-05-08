app.service('AlertHistoryService', function(
    $http,
    $log,
    $filter,
    ConfigDataService,
    AlertTransformer
) {
    var factory = {
        empty: false,
        inProgress: false
    };

    factory.resetData = function() {
        factory.history = {};
        factory.metrics = {
            caps: 0,
            defs: 0,
            wins: {
                vs: 0,
                nc: 0,
                tr: 0,
                draw: 0
            },
            brackets: {
                mor: 0,
                aft: 0,
                pri: 0
            },
            zones: {
                2: 0,
                4: 0,
                6: 0,
                8: 0
            }
        };
    };

    factory.applyFilter = function(filters) {
        if (factory.inProgress === false) {
            factory.resetData();
            factory.inProgress = true;
            var url = ConfigDataService.apiUrl + '/alerts/history/latest?embed=maps';

            // Servers = [1,10,13,17,25,1000,2000];
            if (filters.servers && filters.servers.length > 0) {
                url += '&servers=' + filters.servers.toString();
            }
            // Zones = [2,4,6,8];
            if (filters.zones && filters.zones.length > 0) {
                url += '&zones=' + filters.zones.toString();
            }

            // Factions = ['vs','nc','tr','draw'];
            if (filters.factions && filters.factions.length > 0) {
                url += '&factions=' + filters.factions.toString();
            }

            // Brackets = ['MOR','AFT','PRI'];
            if (filters.brackets && filters.brackets.length > 0) {
                url += '&brackets=' + filters.brackets.toString();
            }

            factory.empty = false;

            // Get the data
            $http({
                method: 'GET',
                url: url,
            }).then(function(data) {
                var returned = data.data.data; // #Dataception

                if (returned.length === 0) {
                    // Stop here and return
                    factory.empty = true;
                    return false;
                }

                // Generate metrics and transform timestamps
                angular.forEach(returned, function(alert) {
                    alert = factory.parseAlert(alert); // Parse the alert and return
                });

                factory.history = returned;
                factory.inProgress = false;
            });
        }
    };

    // Parses alerts to add to the list
    factory.parseAlert = function(alert) {
        alert.lastMap = _.last(alert.maps.data);

        alert.lastMap.controlTotal =
            alert.lastMap.controlVS +
            alert.lastMap.controlNC +
            alert.lastMap.controlTR;

        AlertTransformer.parse(alert).then(function(alert) {
            // Update factory metrics
            factory.metrics.wins[alert.winner.toLowerCase()]++;
            factory.metrics.brackets[alert.timeBracket.toLowerCase()]++;
            factory.metrics.zones[alert.zone]++;

            if (alert.maps.data) {
                angular.forEach(alert.maps.data, function(map) {
                    if (map.isDefence === false) {
                        factory.metrics.caps++;
                    } else {
                        factory.metrics.defs++;
                    }
                });
            }

            return alert;
        });
    };

    // Called by WebsocketService when an alert is declared as ended
    factory.appendAlert = function(alert) {
        // Get the info we need from the API then add to the list
        $http({
            method: 'GET',
            url: ConfigDataService.apiUrl + '/alerts/' + alert.id + '?embed=maps',
        }).then(function(data) {
            var alert = factory.parseAlert(data.data.data);
            alert.dynamic = true;
            factory.history.unshift(alert);
        });
    };

    return factory;
});
