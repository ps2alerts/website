app.directive('homepageAnnouncement', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/home/partials/announcement.html',
        link: function($scope, elem) {
            elem.ready(function() {
                $scope.$emit('ga-sync', '[homepage-announcement] .ga-event');
                $('[homepage-announcement] .tooltipped').tooltip({
                    delay: 50
                });
            });
        }
    };
});
