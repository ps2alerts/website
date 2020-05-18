app.directive('territoryBar', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            vs: '@',
            nc: '@',
            tr: '@',
            draw: '@',
            total: '@',
            decimal: '@',
            showsplitbars: '@'
        },
        templateUrl: 'views/common/territory.bar.html',
        link: function($scope, elem) {
            // Look for any tooltip classes and apply them upon total change (which should always change when updated)
            $scope.$watchCollection('total', function(newValue) {
                if (newValue > 0) {
                    setTimeout(function() {
                        var tips = $(elem).find('.tooltipped');

                        $(tips).each(function(index, el) {
                            $(el).tooltip({delay: 50});
                        });
                    }, 50);
                }
            }, true);
        }
    };
});

app.directive('territoryBarNumerical', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            vs: '@',
            nc: '@',
            tr: '@',
            draw: '@',
            total: '@',
            decimal: '@',
            showsplitbars: '@'
        },
        templateUrl: 'views/common/territory.bar.numerical.html',
        link: function($scope, elem) {
            // Look for any tooltip classes and apply them upon total change (which should always change when updated)
            $scope.$watchCollection('total', function(newValue) {
                if (newValue > 0) {
                    setTimeout(function() {
                        var tips = $(elem).find('.tooltipped');

                        $(tips).each(function(index, el) {
                            $(el).tooltip({delay: 50});
                        });
                    }, 50);
                }
            }, true);
        }
    };
});
