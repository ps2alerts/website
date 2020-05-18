app.controller('OutfitProfileController', function(
    $scope,
    $window,
    $routeParams,
    OutfitProfileService,
    ConfigDataService
) {
    $scope.service = OutfitProfileService;
    $scope.loaded = false;
    $scope.config = ConfigDataService;

    // Instantiate the service
    $scope.service.getProfile($routeParams.id);

    $scope.$on('dataLoaded', function() {
        console.log('event');
        $scope.loaded = true;
        $scope.$apply();

        $scope.$emit('ga-sync', '#outfit-profile .ga-event');

        if ($scope.service.data.players.data.length > 0) {
            $('#player-list').DataTable({
                data: $scope.service.data.players.data,
                columns: [
                    { data: 'name', title: 'Player', className: 'player' },
                    { data: 'kills', title: 'Kills', className: 'metric center-align' },
                    { data: 'deaths', title: 'Deaths', className: 'metric center-align' },
                    { data: 'teamkills', title: 'TKs', className: 'metric center-align' },
                    { data: 'suicides', title: 'Suicides', className: 'metric center-align' },
                    { data: 'headshots', title: 'Headshots', className: 'metric center-align' },
                    { data: 'id', visible: false }
                ],
                order:          [1, 'desc'],
                deferRender:    true,
                scrollY:        450,
                scrollCollapse: true,
                scroller:       true,
                searching:      true,
                "rowCallback": function( row, data, index ) {
                    $('.player', row).html('<a href="profiles/player/' + data.id + '">' + data.name + '</a>');
                }
            });
        }

        if ($scope.service.data.facilities.data.length > 0) {
            $('#facility-list').DataTable({
                data: $scope.service.data.facilities.data,
                columns: [
                    { data: 'name', title: 'Facility', className: 'name' },
                    { data: 'captures', title: 'Captures', className: 'metric center-align' },
                    { data: 'defences', title: 'Defences', className: 'metric center-align' },
                    { data: 'zone', title: 'Continent', className: 'center-align' },
                    { data: 'type', title: 'Type', className: 'center-align' }
                ],
                order:          [1, 'desc'],
                deferRender:    true,
                scrollY:        450,
                scrollCollapse: true,
                scroller:       true,
                searching:      true
            });
        }

        if ($scope.service.data.involvement.data.length > 0) {
            $('#alert-list').DataTable({
                data: $scope.service.data.involvement.data,
                columns: [
                    { data: 'id', title: 'ID', className: 'id center-align' },
                    { data: 'kills', title: 'Kills', className: 'metric center-align' },
                    { data: 'deaths', title: 'Deaths', className: 'metric center-align' },
                    { data: 'teamkills', title: 'TKs', className: 'metric center-align' },
                    { data: 'suicides', title: 'Suicides', className: 'metric center-align' }
                ],
                order:          [0, 'desc'],
                deferRender:    true,
                scrollY:        354,
                scrollCollapse: true,
                scroller:       true,
                searching:      false,
                "rowCallback": function( row, data, index ) {
                    $('.id', row).html('<a href="alert/' + data.id + '">' + data.id + '</a>');
                }
            });
        }

        setTimeout(function() {
            $('.tooltipped').tooltip({
                delay: 50
            });
        },1); // Ewwwww
    });
});
