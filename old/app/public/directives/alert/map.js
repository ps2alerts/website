app.directive('alertMapStats', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/alert/map.html',
        link: function( $scope, elem, attrs ) {
            elem.ready(function(){
                $scope.$emit('ga-sync', '#map-statistics .ga-event');
            });
        }
    };
});
