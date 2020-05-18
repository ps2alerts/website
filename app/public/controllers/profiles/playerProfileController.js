app.controller('PlayerProfileController', function(
    $scope,
    $window,
    $routeParams,
    PlayerProfileService,
    ConfigDataService
) {
    $scope.service = PlayerProfileService;
    $scope.loaded = false;
    $scope.config = ConfigDataService;

    // Instantiate the service
    $scope.service.getProfile($routeParams.id);

    $scope.$on('dataLoaded', function() {
        $scope.loaded = true;
        $scope.$apply();

        $scope.changeTitle('Player Profile - ' + $scope.service.data.name);
        $scope.$emit('ga-sync', '#player-profile .ga-event');

        $('#alert-list').DataTable({
            data: $scope.service.data.involvement.data,
            columns: [
                { data: 'id', title: 'ID', className: 'id center-align' },
                { data: 'kills', title: 'Kills', className: 'metric center-align' },
                { data: 'deaths', title: 'Deaths', className: 'metric center-align' },
                { data: 'teamkills' , title: 'TKs', className: 'metric center-align' },
                { data: 'suicides' , title: 'Suicides', className: 'metric center-align' }
            ],
            order:          [0, 'desc'],
            deferRender:    true,
            scrollY:        532,
            scrollCollapse: true,
            scroller:       true,
            searching:      false,
            "rowCallback": function( row, data, index ) {
                $('.id', row).html('<a href="alert/' + data.id + '">' + data.id + '</a>');
            }
        });

        $('#weapon-list').DataTable({
            data: $scope.service.data.weapons.data,
            columns: [
                { data: 'name', title: 'Weapon', className: 'name'},
                { data: 'kills', title: 'Kills', className: 'metric center-align' },
                { data: 'headshots', title: 'Headshots', className: 'metric center-align' },
                { data: 'teamkills' , title: 'TKs', className: 'metric center-align' }
            ],
            order:          [1, 'desc'],
            deferRender:    true,
            scrollY:        450,
            scrollCollapse: true,
            scroller:       true,
            searching:      true
        });

        /* Removed due to crap data
        $('#vehicle-list').DataTable({
            data: $scope.service.data.vehicles.data,
            columns: [
                { data: 'name', title: 'Vehicle', className: 'name'},
                { data: 'kills', title: 'Kills', className: 'metric center-align' },
                { data: 'killsInf', title: 'I Kills', className: 'metric center-align' },
                { data: 'killsVeh' , title: 'V Kills', className: 'metric center-align' },
                { data: 'deaths' , title: 'Deaths', className: 'metric center-align' },
                { data: 'deathsInf' , title: 'I Deaths', className: 'metric center-align' },
                { data: 'deathsVeh' , title: 'V Deaths', className: 'metric center-align' }
            ],
            order:          [1, 'desc'],
            deferRender:    true,
            scrollY:        450,
            scrollCollapse: true,
            scroller:       true,
            searching:      true
        });
        */
    });
});
