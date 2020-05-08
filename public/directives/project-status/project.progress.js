app.directive('projectProgressBar', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            completed: '@',
            inprogress: '@',
            started: '@',
            notstarted: '@',
            total: '@',
            decimal: '@'
        },
        templateUrl: 'views/project-status/project.progress.html'
    };
});
