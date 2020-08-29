app.directive('alertHistoryFilters', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/alert-history/filters.html',
        link: function( $scope, elem, attrs ) {
            elem.ready(function(){
                $scope.$emit('ga-sync', '[alert-history-filters] .ga-event');
            });
        }
    };
});
