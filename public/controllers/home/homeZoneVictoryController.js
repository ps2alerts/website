app.controller('HomeZoneVictoryController', function(
    $scope,
    HomeZoneVictoryService,
    HomeVictoryStatisticsService,
    ConfigDataService
) {
    $scope.zoneStats = HomeZoneVictoryService;
    $scope.victoryStats = HomeVictoryStatisticsService;
    $scope.config = ConfigDataService;
    $scope.zoneStats.init();
    $scope.loaded = false;
    $scope.mode = 'percentage';

    $scope.$on('zonesLoaded', function() {
        $scope.loaded = true;
        $scope.$apply(); // Fix for slow loading

        var tips = $('#faction-victory-breakdowns').find('.tooltipped');

        $(tips).each(function(index, el) {
            $(el).tooltip({delay: 0});
        });
    });

    $scope.changeBreakdownMode = function(mode) {
        $scope.mode = mode;

        var segments = [
            '#server-victory-breakdown',
            '#zone-victory-breakdown',
            '#server-zone-victory-breakdown',
            '#faction-victory-breakdowns'
        ];

        $(segments).each(function(index, segment) {
            var elems = $(segment).find('.territory-bar .segment-metric');

            $(elems).each(function(index, el) {
                var newHtml = $(el).attr(mode);

                $(el).html(newHtml);
            });
        });
    };
});
