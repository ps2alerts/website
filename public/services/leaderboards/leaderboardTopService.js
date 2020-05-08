app.service('LeaderboardTopService', function(
    $http,
    $rootScope,
    ConfigDataService,
    MetricsProcessingService
) {
    var factory = {};
    factory.limit = 100;

    factory.getConfig = function() {
        $rootScope.$broadcast('loading', 'blah');
        Promise.all([
            factory.getConfigData
        ]).then(function(result) {
            factory.configData = result[0];
            $rootScope.$broadcast('configReady', 'loaded');
        });
    }

    factory.getTopPlayers = function(server, sorting) {
        factory.playerData = {}; // Reset Data

        // Fix for indexOf on filters showing up Kills and Teamkills
        if (sorting === 'tks') {
            sorting = 'teamkills';
        }

        var serverQuery = '&server='+server;
        var fieldQuery = 'field='+sorting;

        if (server === 0) {
            serverQuery = '';
        }

        $http({
            method : 'GET',
            url    : ConfigDataService.apiUrl + '/leaderboards/players?'+fieldQuery + serverQuery +'&limit=' + factory.limit
        }).then(function(returned) {
            factory.playerData = returned.data.data;

            factory.processPlayers(factory.playerData);
            $rootScope.$broadcast('players-loaded', server);
        });
    };

    factory.getTopOutfits = function(server, sorting) {
        factory.outfitData = {}; // Reset Data

        // Fix for indexOf on filters showing up Kills and Teamkills
        if (sorting === 'tks') {
            sorting = 'teamkills';
        }

        var serverQuery = '&server='+server;
        var fieldQuery = 'field='+sorting;

        if (server === 0) {
            serverQuery = '';
        }

        $http({
            method : 'GET',
            url    : ConfigDataService.apiUrl + '/leaderboards/outfits?'+fieldQuery + serverQuery +'&limit=' + factory.limit
        }).then(function(returned) {
            factory.outfitData = returned.data.data;

            factory.processOutfits(factory.outfitData);
            $rootScope.$broadcast('outfits-loaded', server);
        });
    };

    factory.processPlayers = function(data) {
        var pos = 1;
        _.forEach(data, function(row, key) {
            row.pos = pos;
            pos++;

            row.outfitId = null;
            row.outfitName = '';
            row.outfitTag = null;

            if (row.outfit && row.outfit.id > 0) {
                row.outfitId = row.outfit.id;
                row.outfitName = row.outfit.name;
                row.outfitTag = null;
                if (row.outfit.tag) {
                    row.outfitTag = row.outfit.tag;
                }
            }

            row.kd        = MetricsProcessingService.calcKD(row.kills, row.deaths);
            row.kills     = row.kills.toLocaleString();
            row.deaths    = row.deaths.toLocaleString();
            row.teamkills = row.teamkills.toLocaleString();
            row.suicides  = row.suicides.toLocaleString();
            row.headshots = row.headshots.toLocaleString();

            row.serverName = '???';
            if (row.server) {
                row.serverName = ConfigDataService.serverNames[row.server];
            } else {
                console.log('MISSING SERVER INFO FOR PLAYER', row.id);
            }
            row.factionAbv = ConfigDataService.convertFactionIntToName(row.faction);
        });
    }

    factory.processOutfits = function(data) {
        var pos = 1;
        _.forEach(data, function(row, key) {
            row.pos = pos;
            pos++;

            row.kd        = MetricsProcessingService.calcKD(row.kills, row.deaths);
            row.kills     = row.kills.toLocaleString();
            row.deaths    = row.deaths.toLocaleString();
            row.teamkills = row.teamkills.toLocaleString();
            row.suicides  = row.suicides.toLocaleString();
            row.captures  = row.captures.toLocaleString();

            row.factionAbv = ConfigDataService.convertFactionIntToName(row.faction);

            if (row.server) {
                row.serverName = ConfigDataService.serverNames[row.server];
            } else {
                console.log('MISSING SERVER INFO FOR OUTFIT', row.id);
            }

            if (! row.serverName) {
                row.serverName = '???';
            }
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
