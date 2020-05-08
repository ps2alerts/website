app.directive('homeCombatMetricCard', function() {
    return {
        restrict: 'E',
        scope: {
            metric: '@',
            stats:  '=',
            config: '='
        },
        templateUrl: 'views/home/combat/partials/metric.card.html',
    };
});

app.directive('homeCombat', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/home/combat/index.html'
    };
});

app.directive('homeCombatMetrics', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/home/combat/totals.html'
    };
});

app.directive('homeClassMetrics', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/home/combat/class.metrics.html'
    };
});

app.directive('homeWeaponMetrics', function() {
    return {
        restrict: 'A',
        templateUrl: 'views/home/combat/weapon.metrics.html'
    };
});

app.directive('homeCombatClassMetrics', function() {
    return {
        restrict: 'E',
        scope: {
            metric: '@',
            stats:  '=',
            config: '=',
            factions: '='
        },
        templateUrl: 'views/home/combat/partials/class.metrics.card.html',
    };
});

app.directive('homeCombatClassMetricsKdr', function() {
    return {
        restrict: 'E',
        scope: {
            metric: '@',
            stats:  '=',
            config: '=',
            factions: '='
        },
        templateUrl: 'views/home/combat/partials/class.metrics.card.kdr.html',
    };
});

app.directive('homeCombatBar', function() {
    return {
        restrict: 'E',
        scope: {
            factions: '=',
            metric: '=',
            class: '=',
            stats: '=',
            showsplitbars: '@'
        },
        templateUrl: 'views/home/combat/partials/bar.combat.html'
    };
});

app.directive('homeCombatBarKdr', function() {
    return {
        restrict: 'E',
        scope: {
            factions: '=',
            class: '=',
            stats: '=',
            showsplitbars: '@'
        },
        templateUrl: 'views/home/combat/partials/bar.combat.kdr.html'
    };
});
