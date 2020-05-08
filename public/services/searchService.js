app.service('SearchService', function(ConfigDataService, $http, $rootScope) {
    var factory = {};

    factory.searching = false;
    factory.noresults = false;
    factory.show = false;
    factory.results = [];

    factory.search = function(type, term) {
        term = encodeURIComponent(term); // Encodes into URI friendly notation
        factory.results = [];
        factory.searching = true;
        factory.noresults = false;

        $http({
            method: 'GET',
            url: ConfigDataService.apiUrl + '/search/' + type + '/' + term
        }).then(function(returned) {
            var data = returned.data.data;
            factory.searching = false;
            if (data.length > 0) {
                angular.forEach(data, function(row) {
                    row.server = ConfigDataService.serverNames[row.server];
                    row.factionAbv = ConfigDataService.convertFactionIntToName(row.faction);
                });

                factory.results = data;
            }

            $rootScope.$broadcast('showSearchResults', 'loaded');
        }, function(error) {
            console.log('Error!', error);
            factory.results = [];
            factory.searching = false;
            $rootScope.$broadcast('showSearchResults', 'loaded');
        });
    };

    return factory;
});
