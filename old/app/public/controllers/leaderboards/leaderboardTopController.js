app.controller('LeaderboardTopController', function(
    $scope,
    $location,
    LeaderboardTopService,
    ConfigDataService,
    MetricsProcessingService
) {
    $scope.service = LeaderboardTopService;
    $scope.config = ConfigDataService;

    $scope.loaded = false;
    $scope.gaDone = false;

    $scope.limit = $scope.service.limit;
    $scope.path = $location.path();

    $scope.playersLoaded = false;
    $scope.playersServer = 0;
    $scope.playersSorting = 'kills';
    $scope.playersSortingOptions = ['kills', 'deaths', 'tks', 'suicides', 'headshots'];

    $scope.outfitsLoaded = false;
    $scope.outfitsServer = 0;
    $scope.outfitsSorting = 'kills';
    $scope.outfitsSortingOptions = ['kills', 'deaths', 'tks', 'suicides', 'captures'];

    $scope.service.getConfig();

    $scope.changePlayerServer = function(server) {
        $scope.playersServer = server;
        $scope.getTopPlayers();
    };

    $scope.changePlayerSorting = function(sorting) {
        $scope.playersSorting = sorting;
        $scope.getTopPlayers();
    };

    $scope.changeOutfitServer = function(server) {
        $scope.outfitsServer = server;
        $scope.getTopOutfits();
    };

    $scope.changeOutfitSorting = function(sorting) {
        $scope.outfitsSorting = sorting;
        $scope.getTopOutfits();
    };

    $scope.getTopPlayers = function() {
        $scope.playersLoaded = false;
        $("#top-players-container").css('opacity', 0.5);
        $scope.service.getTopPlayers($scope.playersServer, $scope.playersSorting);
    };

    $scope.getTopOutfits = function() {
        $scope.outfitsLoaded = false;
        $("#top-outfits-container").css('opacity', 0.5);
        $scope.service.getTopOutfits($scope.outfitsServer, $scope.outfitsSorting);
    };

    $scope.changeTab = function(tab) {
        setTimeout(function() {
            var table = $('#top-' + tab).DataTable();
            table.draw();
            table.scroller.measure(); // Fix for rows not rendering bug
        }, 10);
    };

    $scope.$on('configReady', function() {
        // Houston, We are go.
        $scope.getTopPlayers();
        $scope.getTopOutfits();
    });

    $scope.$on('players-loaded', function(event) {
        $scope.loaded = true;
        $scope.playersLoaded = true;

        if ( $.fn.DataTable.isDataTable('#top-players') ) {
            var table = $('#top-players').DataTable();
            table.clear();
            table.rows.add($scope.service.playerData);
            table.draw();
        } else {
            $scope.initPlayerDataTable();
        }

        $("#top-players-container").css('opacity', 1);

        $('ul.tabs').tabs();

        $scope.$emit('ga-sync', '.leaderboards .ga-event');
    });

    $scope.$on('outfits-loaded', function(event) {
        $scope.loaded = true;
        $scope.outfitsLoaded = true;

        if ( $.fn.DataTable.isDataTable('#top-outfits') ) {
            var table = $('#top-outfits').DataTable();
            table.clear();
            table.rows.add($scope.service.outfitData);
            table.draw();
        } else {
            $scope.initOutfitDataTable();
        }

        $("#top-outfits-container").css('opacity', 1);

        $('ul.tabs').tabs();

        $scope.$emit('ga-sync', '.leaderboards .ga-event');
    });

    $scope.initPlayerDataTable = function() {
        $('#top-players').DataTable({
            data: $scope.service.playerData,
            columns: [
                { data: 'pos', title: '#', className: 'pos center-align' },
                { data: 'name', title: 'Player', className: 'name' },
                { data: 'outfitName', title: 'Outfit', className: 'outfit' },
                { data: 'serverName', title: 'Server', className: 'center-align' },
                { data: 'kills', title: 'Kills', className: 'metric center-align' },
                { data: 'deaths', title: 'Deaths', className: 'metric center-align' },
                { data: 'kd', title: 'K/D', className: 'metric center-align' },
                { data: 'teamkills', title: 'TKs', className: 'metric center-align' },
                { data: 'suicides', title: 'Suicides', className: 'metric center-align' },
                { data: 'headshots', title: 'Headshots', className: 'metric center-align' },
                { data: 'id', visible: false }
            ],
            order:          [3, 'desc'],
            deferRender:    true,
            scrollY:        380,
            scrollCollapse: true,
            scroller:       true,
            searching:      true,
            ordering:       false,
            "rowCallback": function( row, data, index ) {
                // Format the faction colors
                if (data.factionAbv !== null) {
                    $('.pos', row).addClass(data.factionAbv + '-table-text');
                }

                $('.name', row).html('<a href="profiles/player/' + data.id + '">' + data.name + '</a>');
                if (data.outfitId) {
                    $('.outfit', row).html('<a href="profiles/outfit/' + data.outfitId + '">' + data.outfitName + '</a>');
                }
            }
        });
    };

    $scope.initOutfitDataTable = function() {
        $('#top-outfits').DataTable({
            data: $scope.service.outfitData,
            columns: [
                { data: 'pos', title: '#', className: 'pos center-align' },
                { data: 'name', title: 'Player', className: 'name' },
                { data: 'tag', title: 'Tag', className: 'tag center-align' },
                { data: 'serverName', title: 'Server', className: 'center-align' },
                { data: 'kills', title: 'Kills', className: 'metric center-align' },
                { data: 'deaths', title: 'Deaths', className: 'metric center-align' },
                { data: 'kd', title: 'K/D', className: 'metric center-align' },
                { data: 'teamkills', title: 'TKs', className: 'metric center-align' },
                { data: 'suicides', title: 'Suicides', className: 'metric center-align' },
                { data: 'captures', title: 'Captures', className: 'metric center-align' },
                { data: 'id', visible: false }
            ],
            order:          [3, 'desc'],
            deferRender:    true,
            scrollY:        380,
            scrollCollapse: true,
            scroller:       true,
            searching:      true,
            ordering:       false,
            "rowCallback": function( row, data, index ) {
                // Format the faction colors
                if (data.factionAbv !== null) {
                    $('.pos', row).addClass(data.factionAbv + '-table-text');
                    $('.tag', row).addClass(data.factionAbv + '-table-text');
                }

                $('.name', row).html('<a href="profiles/outfit/' + data.id + '">' + data.name + '</a>');
            }
        });
    };
});
