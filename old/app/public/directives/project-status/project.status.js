app.directive('projectStatus', function() {
    return {
        restrict: 'A',
        scope: {
            cardTitle:    '@',
            cardSubtitle: '@',
            sizing:       '@',
            project:      '='
        },
        templateUrl: 'views/project-status/project.status.html',
        link: function($scope, elem) {
            elem.ready(function() {
                $scope.$emit('project-status');
            });
        }
    };
});
