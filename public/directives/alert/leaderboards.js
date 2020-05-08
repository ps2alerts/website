app.directive('alertLeaderboards', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/alert/combat.leaderboards.html',
        link: function( $scope, elem, attrs ) {
            elem.ready(function(){
                $scope.$emit('ga-sync', '#combat-leaderboards .ga-event');
            });
        }
    };
});
