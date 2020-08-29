app.controller('LeaderboardWeaponsController', function(
    $scope,
    $location,
    LeaderboardWeaponService,
    ConfigDataService,
    MetricsProcessingService
) {
    $scope.service = LeaderboardWeaponService;
    $scope.config = ConfigDataService;

    $scope.limit = $scope.service.limit;
    $scope.path = $location.path();

    $scope.weaponsLoaded = false;
    $scope.weaponsSorting = 'kills';
    $scope.weaponsSortingOptions = ['kills', 'tks', 'headshots'];

    $scope.service.getConfig();

    $scope.changeWeaponSorting = function(sorting) {
        $scope.weaponsSorting = sorting;
        $scope.getTopWeapons();
    };

    $scope.getTopWeapons= function() {
        $scope.weaponsLoaded = false;
        $scope.service.getTopWeapons($scope.weaponsSorting);
    };

    $scope.$on('configReady', function() {
        $scope.getTopWeapons();
    });

    $scope.$on('weapons-loaded', function(event) {
        $scope.weaponsLoaded = true;

        if ( $.fn.DataTable.isDataTable('#top-weapons') ) {
            var table = $('#top-weapons').DataTable();
            table.clear();
            table.rows.add($scope.service.weaponData);
            table.draw();
        } else {
            $scope.initWeaponDataTable();
        }

        $('ul.tabs').tabs();

        $scope.$emit('ga-sync', '.leaderboards .ga-event');
    });

    $scope.initWeaponDataTable = function() {
        $('#top-weapons').DataTable({
            data: $scope.service.weaponData,
            columns: [
                { data: 'pos', title: '#', className: 'pos center-align' },
                { data: 'name', title: 'Weapon', className: 'name' },
                { data: 'kills', title: 'Kills', className: 'center-align' },
                { data: 'teamkills', title: 'TKs', className: 'center-align' },
                { data: 'headshots', title: 'Headshots', className: 'center-align' },
                { data: 'hsr', title: 'HSR %', className: 'center-align' },
                { data: 'id', visible: false },
                { data: 'vehicle', visible: false },
            ],
            order:          [3, 'desc'],
            deferRender:    true,
            scrollY:        380,
            scrollCollapse: true,
            scroller:       true,
            searching:      true,
            ordering:       false,
            "rowCallback": function( row, data, index ) {
                var vehicle = ' [I]';
                // Format the cells
                if (data.factionAbv !== null) {
                    $('.name', row).addClass(data.factionAbv + '-table-text');
                }

                if (data.vehicle === 1) {
                    vehicle = ' [V]';
                }

                $('.name', row).html(data.name + vehicle);
                $('.hsr', row).html(data.hsr + '%');
            }
        });
    }
});
