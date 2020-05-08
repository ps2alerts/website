app.directive('metricCard', function() {
    return {
        restrict: 'A',
        scope: {
            cardTitle: '@',
            metric:    '@'
        },
        templateUrl: 'views/common/partials/metric.card.html',
    };
});
