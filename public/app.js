'use strict';

var app = angular.module('Ps2Alerts', [
    'ngRoute',
    'config',
    'ngCookies',
    'ngLoadScript'
]);
app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            title: 'Home',
            templateUrl: 'views/home/index.html'
        })
        .when('/home', {
            title: 'Home',
            templateUrl: 'views/home/index.html'
        })
        .when('/alert-history', {
            title: 'Alert History',
            templateUrl: 'views/alert-history/index.html'
        })
        .when('/about', {
            title: 'About PS2Alerts',
            templateUrl: 'views/about/index.html'
        })
        .when('/alert/:alert', {
            title: 'Alert',
            templateUrl: 'views/alert/index.html'
        })
        .when('/profiles/player/:id', {
            title: 'Player Profile',
            templateUrl: 'views/profiles/player/index.html'
        })
        .when('/profiles/outfit/:id', {
            title: 'Outfit Profile',
            templateUrl: 'views/profiles/outfit/index.html'
        })
        .when('/leaderboards', {
            title: 'Leaderboards - Top Lists',
            templateUrl: 'views/leaderboards/index.html'
        })
        .when('/leaderboards/players', {
            title: 'Leaderboards - Players',
            templateUrl: 'views/leaderboards/players.html'
        })
        .when('/leaderboards/outfits', {
            title: 'Leaderboards - Outfits',
            templateUrl: 'views/leaderboards/outfits.html'
        })
        .when('/leaderboards/weapons', {
            title: 'Leaderboards - Weapons',
            templateUrl: 'views/leaderboards/weapons.html'
        })
        .when('/leaderboards/vehicles', {
            title: 'Leaderboards - Vehicles',
            templateUrl: 'views/leaderboards/vehicles.html'
        })
        .when('/change-log', {
            title: 'Change Log',
            templateUrl: 'views/change-log/index.html'
        })
        .when('/project-status', {
            title: 'Project Status',
            templateUrl: 'views/project-status/index.html'
        })
        .otherwise({
            title: 'Not found!',
            templateUrl: 'views/common/404.html'
        });
    $locationProvider.html5Mode(true);
});

app.run(function(
    $rootScope,
    $templateCache,
    $location,
    AnalyticsService
) {
    var analytics = AnalyticsService;

    $rootScope.$on('$routeChangeSuccess', function(event, current) {
        $templateCache.removeAll();
        $rootScope.title = current.$$route.title + ' - PS2Alerts';
    });

    $rootScope.changeTitle = function(title) {
        $rootScope.title = title + ' - PS2Alerts';
    };

    $rootScope.$on('$viewContentLoaded', function() {
        $(window).trigger('viewLoaded');
        $templateCache.removeAll();
        setTimeout(function() {
            $('.tooltipped').tooltip({
                delay: 50
            });
        }, 1); // Ewwwww
    });

    // Allow for hash ID scrolling, e.g. for home combat
    $rootScope.$on('$routeChangeSuccess', function() {
        if ($location.hash()) {
            $anchorScroll();
        }
    });

    $rootScope.$on('project-status', function() {
        console.log('Rendering project-status');
        $('.collapsible').collapsible({
            // A setting that changes the collapsible behavior to expandable instead of the default accordion style
            accordion: false
        });
    });
});

app.filter('ucfirst', function() {
    return function(input) {
        return input.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    };
});

app.filter('shortNumber', function() {
    return function(number, precision) {
        if (precision === undefined) {
            precision = 2;
        }
        if (number) {
            var abs = Math.abs(number);
            if (abs >= Math.pow(10, 12)) {
                // trillion
                number = (number / Math.pow(10, 12)).toFixed(precision) + 'T';
            } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9)) {
                // billion
                number = (number / Math.pow(10, 9)).toFixed(precision) + 'B';
            } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)) {
                // million
                number = (number / Math.pow(10, 6)).toFixed(precision) + 'M';
            } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)) {
                // thousand
                number = (number / Math.pow(10, 3)).toFixed(precision) + 'K';
            }
            return number;
        }
    };
});

$(window).on('load', function() {
    $('.button-collapse').sideNav({
        edge: 'left',
        closeOnClick: true
    });
    $('.tooltipped').tooltip({
        delay: 50
    });
});
