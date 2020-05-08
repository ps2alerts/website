app.directive('alertFab', function() {
    return {
        templateUrl: 'views/alert/fab.html',
        link: function( $scope, elem, attrs ) {
            elem.ready(function(){
                $scope.$emit('ga-sync', '#alert-fab .ga-event');
            });
        }
    };
});
