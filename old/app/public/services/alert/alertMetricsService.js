app.service('AlertMetricsService', function(
    $filter,
    $http,
    $rootScope,
    $routeParams,
    AlertMetricsProcessingService,
    AlertTransformer,
    ConfigDataService,
    PS2AlertsAPIService,
    RealtimeMetricsService
) {
    var factory = {};

    factory.init = function(alertID) {
        $rootScope.changeTitle('Alert #' + alertID);

        // Holds flattened versions of the data for datatables
        factory.metrics = {
            combat: {},
            dpms: {
                total: 0,
                vs: 0,
                nc: 0,
                tr: 0
            },
            facilities: [],
            factions: {
                vs: {
                    kills:     0,
                    deaths:    0,
                    suicides:  0,
                    teamkills: 0,
                    players:   0
                },
                nc: {
                    kills:     0,
                    deaths:    0,
                    suicides:  0,
                    teamkills: 0,
                    players:   0
                },
                tr: {
                    kills:     0,
                    deaths:    0,
                    suicides:  0,
                    teamkills: 0,
                    players:   0
                }
            },
            kpms: {
                total: 0,
                vs: 0,
                nc: 0,
                tr: 0
            },
            map: {
                captures: [],
                defences: [],
                all: []
            },
            outfits:  [],
            players:  [],
            vehicles: [],
            weapons:  [],
        };

        // Fire off the queries required to get the data
        Promise.all([
            PS2AlertsAPIService.getConfigData,
            PS2AlertsAPIService.getAlertData(alertID),
        ]).then(function(result) {
            factory.configData = result[0];
            AlertTransformer.parse(result[1]).then(function(alert) {
                factory.alert = alert;

                // Set up alaises
                factory.metrics.combat = alert.combats.data;
                factory.metrics.populations = alert.populations.data;

                console.log('alert', factory.alert);
                AlertMetricsProcessingService.init(factory);
                RealtimeMetricsService.init(factory);

                // FIRE!!!
                factory.startProcessing(factory.alert).then(function() {
                    console.log('Processing completed!');
                    $rootScope.$broadcast('dataLoaded', 'loaded');
                    console.log('Factory', factory);
                });
            });
        });
    };

    factory.startProcessing = function() {
        return new Promise(function(resolve) {
            var serverName = ConfigDataService.serverNames[factory.alert.server];
            var winnerTitle = factory.alert.winner.toUpperCase();

            if (!factory.alert.winner) {
                winnerTitle = 'TBD';
            }

            $rootScope.changeTitle('Alert #' + factory.alert.id + ' (' + factory.alert.server + ' - ' + winnerTitle + ')');

            // Build player and outfit reference objects so we don't have to do
            // tons of loops on every single kill to get player / outfit info
            AlertMetricsProcessingService.initOutfits().then(function() {
                Promise.all([
                    AlertMetricsProcessingService.initPlayers(),
                    AlertMetricsProcessingService.initWeapons(),
                    AlertMetricsProcessingService.initVehicles(),
                    AlertMetricsProcessingService.initMap()
                ]).then(function() {
                    console.log('All data properly initialized');
                    // Sort the data
                    factory.sortPlayers('kills');
                    factory.sortFacilities('captures');

                    angular.forEach(ConfigDataService.factions, function(faction) {
                        if (faction !== 'draw') {
                            factory.metrics.factions[faction].kills     = factory.alert.combats.data.kills[faction];
                            factory.metrics.factions[faction].deaths    = factory.alert.combats.data.deaths[faction];
                            factory.metrics.factions[faction].teamkills = factory.alert.combats.data.teamkills[faction];
                            factory.metrics.factions[faction].suicides  = factory.alert.combats.data.suicides[faction];
                        }
                    });

                    resolve();
                });
            });
        });
    };

    factory.sortPlayers = function(metric) {
        factory.sortPlayersByMetric(factory.metrics.players, metric);
    };

    factory.sortFacilities = function(metric) {
        factory.sortFacilitiesByMetric(factory.metrics.facilities, metric);
    };

    // Look into extracting this logic into a new function at some point
    factory.sortFacilitiesByMetric = function(object, metric) {
        object.sort(function(fac1, fac2) {
            if (fac1[metric] < fac2[metric]) {
                return 1;
            }
            if (fac1[metric] > fac2[metric]) {
                return -1;
            }

            // If the metrics are exact, make sure to sort by defences
            if (fac1[metric] === fac2[metric]) {
                if (fac1.defences < fac2.defences) {
                    return 1;
                }

                if (fac1.defences > fac2.defences) {
                    return -1;
                }

                // If they are also the same, sort by name
                if (fac1.name > fac2.name) {
                    return 1;
                }
                return -1;
            }
            return 0;
        });
    };

    // Function to sort players metrics
    factory.sortPlayersByMetric = function(object, metric) {
        object.sort(function(p1, p2) {
            if (p1[metric] < p2[metric]) {
                return 1;
            }
            if (p1[metric] > p2[metric]) {
                return -1;
            }

            // If the are exact, make sure to sort by name
            if (p1[metric] === p2[metric]) {
                if (p1.name > p2.name) {
                    return 1;
                }
                return -1;
            }
            return 0;
        });
    };

    // Promise to get outfit details, either from parsed data, raw data or API
    factory.getOutfit = function(outfitID) {
        return new Promise(function(resolve, reject) {
            // console.log('Looking for outfit #' + outfitID);
            if (!outfitID || outfitID == 0) {
                console.log('Invalid outfit ID');
                resolve(null);
            }

            factory.findOutfitFromParsed(outfitID).then(function(outfit) {
                // console.log('Found outfit #' + outfitID + ' from PARSED data');
                resolve(outfit, false);
            }, function() {
                // console.log('findOutfitFromParsed returned nothing for outfit #' + outfitID);
                factory.findOutfitFromAPI(outfitID).then(function(outfit) {
                    console.log('Found outfit #' + outfitID + ' from API data');
                    resolve(outfit, true);
                }, function() {
                    console.log('UNABLE TO DETERMINE OUTFIT!!!');
                    reject();
                });
            });
        });
    };

    factory.findOutfitFromParsed = function(outfitID) {
        return new Promise(function(resolve, reject) {
            // Find the array key for the outfit by ID
            var outfitRef = _.findIndex(
                factory.metrics.outfits, {'id': outfitID}
            );

            // Pull the outfit data
            var outfit = factory.metrics.outfits[outfitRef];

            if (outfit) {
                resolve(outfit);
            }

            reject();
        });
    };

    factory.findOutfitFromAPI = function(outfitID) {
        return new Promise(function(resolve, reject) {
            // Attempt to get data from API
            console.log('Local outfit #' + outfitID + ' not found... pulling from API');
            if (!outfitID || outfitID <= 0) {
                console.log('Chucking out invalid ID');
                reject('Invalid Outfit ID');
            }

            PS2AlertsAPIService.getOutfitFromAPI(outfitID).then(function(data) {
                console.log('Found outfit #' + outfitID + ' from API data', data);

                // Add the outfit to the factory
                var newOutfit = {
                    outfit: {
                        faction: data.faction,
                        id: data.id,
                        name: data.name,
                        tag: data.tag
                    },
                    metrics: {
                        deaths: 0,
                        kills: 0,
                        suicides: 0,
                        teamkills: 0
                    }
                };

                AlertMetricsProcessingService.addNewOutfit(newOutfit).then(function() {
                    var outfitRef = _.findIndex(
                        factory.metrics.outfits, {'id': outfitID}
                    );
                    // console.log('Added new outfit #' + outfitID + ' to factory', factory.metrics.outfits[outfitRef]);

                    if (!outfitRef) {
                        console.log('UNABLE TO GET OUTFITREF!', outfitID);
                        reject('Unable to get Outfit REF');
                    }

                    resolve(factory.metrics.outfits[outfitRef]);
                });
            });
        });
    };

    factory.processCombatMessage = function(message) {
        RealtimeMetricsService.increaseCombatKills(message);
        RealtimeMetricsService.updatePlayerMetrics(message).then();
        RealtimeMetricsService.updateOutfitMetrics(message).then();
        RealtimeMetricsService.updateWeaponMetrics(message).then();
    };

    factory.processVehicleCombatMessage = function(message) {
        RealtimeMetricsService.updateVehicleMetrics(message).then();
    };

    factory.processMapCapture = function(message) {
        AlertMetricsProcessingService.addNewCapture(message).then();
    };

    factory.processEndAlert = function(message) {
        console.log('Ending alert', message);

        if (message.resultID != factory.alert.id) {
            console.log('Ignoring alert end message');
            return false;
        }

        // Change end time to be JS format
        message.endTime = message.endTime * 1000;

        factory.alert.winner = message.winner.toLowerCase();
        factory.alert.winnerText = ConfigDataService.factionsAlpha[message.winner.toLowerCase()];
        factory.alert.ended = 1;
        factory.alert.inProgress = false;
        factory.alert.endedDate = $filter('date')(message.endTime, 'dd-MMM-yyyy HH:mm:ss');
        factory.alert.duration = message.endTime - factory.alert.started;
        factory.alert.durationTime = $filter('date')(
            factory.alert.duration,
            'HH:mm:ss',
            'UTC'
        );
        factory.alert.durationMins = Math.round((factory.alert.duration / 1000) / 60);

        RealtimeMetricsService.endAlert();
    };

    factory.changeTab = function(tab) {
        RealtimeMetricsService.changeTab(tab);
    };

    return factory;
});
