app.directive('historyRow', function(HomeVictoryStatisticsService) {
    return {
        restrict: 'A',
        scope : {
            metrics: '=',
            config: '='
        },
        templateUrl: 'views/alert-history/history.row.html',
    };
});
