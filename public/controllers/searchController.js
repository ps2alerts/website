app.controller('SearchController', function($scope, SearchService) {
    $scope.type        = 'player';
    $scope.term        = '';
    $scope.placeholder = '';
    $scope.service = SearchService;

    $scope.timeout = null;

    $scope.fireSearch = function() {
        console.log('Firing search');

        if ($scope.term.length > 1) {
            SearchService.search($scope.type, $scope.term);
        }
    };

    $scope.show = function() {
        if ($scope.service.results.length > 0) {
            $('#search-results').fadeIn();
        }
    };

    $scope.hide = function() {
        $('#search-results').fadeOut();
    };

    $scope.clear = function() {
        $scope.hide();
        $scope.service.results = [];
        $scope.term = '';
    };

    $scope.$watch('type', function() {
        $scope.placeholder = 'Search ' + _.capitalize($scope.type) + ' Profiles';
    });

    $scope.$on('showSearchResults', function() {
        $('#search-results').fadeIn();
        var options = {
            hitType: 'event',
            eventCategory: 'Search',
            eventAction: $scope.type,
            eventLabel: $scope.term
        };
        ga('send', options);
    });

    $(document).on('click', function(e) {
        if ($(e.target).closest('#site-search').length === 0) {
            $scope.hide();
        }
    });
});
