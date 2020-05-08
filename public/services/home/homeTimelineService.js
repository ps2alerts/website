app.service('HomeTimelineService', function ($http, $log, ConfigDataService, $rootScope) {
    var factory = {
        dates: {}
    };

    factory.incrementVictory = function(date, faction) {
        factory.dates[date][faction]++;
        factory.dates[date].total++;
    };

    factory.init = function() {
        // Get the data
        $http({
            method : 'GET',
            url    : ConfigDataService.apiUrl + '/alerts/counts/daily'
        }).then(function(data) {
            var returned = data.data.data; //#dataception

            angular.forEach(returned, function(values, date) {
                factory.dates[date] = values.data;
            });

            $rootScope.$broadcast('timeline-loaded', 'loaded');
        });
    };

    return factory;
});
